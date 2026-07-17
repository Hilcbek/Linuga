"""Lingua's voice-only AI language teacher service."""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping, Optional, cast

from dotenv import load_dotenv
from getstream.video.rtc import PcmData
from getstream.video.async_call import Call as StreamCall
from vision_agents.core import Agent, AgentLauncher, Runner, ServeOptions, User
from vision_agents.core.edge.types import Participant
from vision_agents.core.utils.audio_filter import AudioFilter
from vision_agents.plugins import gemini, getstream


PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env", override=False)

logger = logging.getLogger(__name__)

REQUIRED_ENVIRONMENT_VARIABLES = (
    "GOOGLE_API_KEY",
    "STREAM_API_KEY",
    "STREAM_API_SECRET",
)
DEFAULT_GEMINI_LIVE_MODEL = "gemini-3.1-flash-live-preview"
DEFAULT_GEMINI_LIVE_VOICE = "Leda"
AGENT_USER_ID = (
    os.getenv("VISION_AGENT_USER_ID", "lingua-ai-teacher").strip()
    or "lingua-ai-teacher"
)

TEACHER_INSTRUCTIONS = """
You are Lingua's warm, patient AI language teacher in a one-on-one audio lesson.
Always conduct the lesson in English. Teach the selected target language through
English: introduce short target-language words or phrases, then explain their
meaning and pronunciation in English. Never switch the whole conversation away
from English.

Keep each spoken reply concise, natural, and easy to follow. Use one or two short
sentences at a time, avoid markdown and visual formatting, and ask only one
question at a time. Encourage the learner gently, correct mistakes clearly, and
pause so the learner has room to answer. Stay focused on the selected language
and lesson supplied in the session context.
""".strip()


class LessonContextError(ValueError):
    """Raised when a Stream call does not contain valid lesson context."""


class SingleLearnerAudioFilter(AudioFilter):
    """Pass through audio without loading the SDK's multi-speaker VAD model."""

    async def process_audio(
        self,
        pcm: PcmData,
        participant: Participant,
    ) -> PcmData:
        del participant
        return pcm

    def clear(self, participant: Optional[Participant] = None) -> None:
        del participant


@dataclass(frozen=True)
class LessonGoal:
    """The outcome the teacher should guide the learner toward."""

    summary: str
    outcomes: tuple[str, ...]

    @classmethod
    def from_value(cls, value: object) -> "LessonGoal":
        mapping = _required_mapping(value, "lesson_goal")
        return cls(
            summary=_required_text(mapping, "summary"),
            outcomes=_required_text_list(mapping, "outcomes"),
        )


@dataclass(frozen=True)
class VocabularyItem:
    """One server-authored vocabulary item from the selected lesson."""

    term: str
    translation: str
    pronunciation: Optional[str]
    example: Optional[str]
    example_translation: Optional[str]

    @classmethod
    def from_value(cls, value: object) -> "VocabularyItem":
        mapping = _required_mapping(value, "lesson_vocabulary item")
        return cls(
            term=_required_text(mapping, "term"),
            translation=_required_text(mapping, "translation"),
            pronunciation=_optional_text(mapping, "pronunciation"),
            example=_optional_text(mapping, "example"),
            example_translation=_optional_text(mapping, "exampleTranslation"),
        )


@dataclass(frozen=True)
class LessonPhrase:
    """One phrase the learner should hear and practice."""

    text: str
    translation: str
    pronunciation: Optional[str]
    usage_note: Optional[str]

    @classmethod
    def from_value(cls, value: object) -> "LessonPhrase":
        mapping = _required_mapping(value, "lesson_phrases item")
        return cls(
            text=_required_text(mapping, "text"),
            translation=_required_text(mapping, "translation"),
            pronunciation=_optional_text(mapping, "pronunciation"),
            usage_note=_optional_text(mapping, "usageNote"),
        )


@dataclass(frozen=True)
class LessonContext:
    """Trusted lesson metadata stored on the Stream call by the Expo API route."""

    language_id: str
    language_code: str
    language_locale: str
    language_name: str
    language_native_name: str
    lesson_id: str
    lesson_title: str
    lesson_description: str
    lesson_level: str
    lesson_format: str
    goal: LessonGoal
    vocabulary: tuple[VocabularyItem, ...]
    phrases: tuple[LessonPhrase, ...]
    teacher_opening_line: str
    ai_teacher_prompt: str

    @classmethod
    def from_custom(cls, custom: Mapping[str, object]) -> "LessonContext":
        return cls(
            language_id=_required_text(custom, "language_id"),
            language_code=_required_text(custom, "language_code"),
            language_locale=_required_text(custom, "language_locale"),
            language_name=_required_text(custom, "language_name"),
            language_native_name=_required_text(custom, "language_native_name"),
            lesson_id=_required_text(custom, "lesson_id"),
            lesson_title=_required_text(custom, "lesson_title"),
            lesson_description=_required_text(custom, "lesson_description"),
            lesson_level=_required_text(custom, "lesson_level"),
            lesson_format=_required_text(custom, "lesson_format"),
            goal=LessonGoal.from_value(custom.get("lesson_goal")),
            vocabulary=tuple(
                VocabularyItem.from_value(item)
                for item in _required_list(custom, "lesson_vocabulary")
            ),
            phrases=tuple(
                LessonPhrase.from_value(item)
                for item in _required_list(custom, "lesson_phrases")
            ),
            teacher_opening_line=_required_text(custom, "teacher_opening_line"),
            ai_teacher_prompt=_required_text(custom, "ai_teacher_prompt"),
        )


def _required_text(custom: Mapping[str, object], key: str) -> str:
    value = custom.get(key)
    if not isinstance(value, str) or not value.strip():
        raise LessonContextError(
            f"Stream call custom data is missing a valid '{key}' value."
        )
    return value.strip()


def _optional_text(custom: Mapping[str, object], key: str) -> Optional[str]:
    value = custom.get(key)
    if value is None:
        return None
    if not isinstance(value, str) or not value.strip():
        raise LessonContextError(
            f"Stream call custom data has an invalid '{key}' value."
        )
    return value.strip()


def _required_mapping(value: object, label: str) -> Mapping[str, object]:
    if not isinstance(value, Mapping):
        raise LessonContextError(
            f"Stream call custom data is missing a valid '{label}' object."
        )
    return value


def _required_list(custom: Mapping[str, object], key: str) -> list[object]:
    value = custom.get(key)
    if not isinstance(value, list) or not value:
        raise LessonContextError(
            f"Stream call custom data is missing a valid '{key}' list."
        )
    return value


def _required_text_list(
    custom: Mapping[str, object], key: str
) -> tuple[str, ...]:
    values = _required_list(custom, key)
    normalized: list[str] = []

    for value in values:
        if not isinstance(value, str) or not value.strip():
            raise LessonContextError(
                f"Stream call custom data has an invalid '{key}' item."
            )
        normalized.append(value.strip())

    return tuple(normalized)


def validate_environment() -> None:
    """Fail early with a useful message instead of a provider authentication error."""

    missing = [name for name in REQUIRED_ENVIRONMENT_VARIABLES if not os.getenv(name)]
    if missing:
        names = ", ".join(missing)
        raise RuntimeError(
            f"Missing required environment variables: {names}. "
            "Set them in the repository root .env file."
        )


def build_kickoff_prompt(context: LessonContext) -> str:
    """Create the first private instruction sent to the realtime teacher."""

    outcomes = "; ".join(context.goal.outcomes)
    vocabulary = "; ".join(
        _format_vocabulary_item(item) for item in context.vocabulary
    )
    phrases = "; ".join(_format_lesson_phrase(phrase) for phrase in context.phrases)

    return " ".join(
        (
            "Use this authoritative session context for the entire lesson.",
            context.ai_teacher_prompt,
            f"The target language is {context.language_name} "
            f"({context.language_native_name}), language code {context.language_code}, "
            f"locale {context.language_locale}, and id {context.language_id}.",
            f"The selected {context.lesson_level} {context.lesson_format} lesson is "
            f"{context.lesson_title} (lesson id: {context.lesson_id}).",
            f"Lesson description: {context.lesson_description}",
            f"Lesson goal: {context.goal.summary}",
            f"Required outcomes: {outcomes}",
            f"Lesson vocabulary: {vocabulary}",
            f"Practice phrases: {phrases}",
            f"Begin with this teacher opening line: {context.teacher_opening_line}",
            "Then ask one short practice question, listen to the learner, and continue "
            "using only this lesson's goals, vocabulary, and phrases.",
        )
    )


def _format_vocabulary_item(item: VocabularyItem) -> str:
    details = f"{item.term} means {item.translation}"
    if item.pronunciation:
        details += f" (pronounced {item.pronunciation})"
    if item.example:
        details += f", example: {item.example}"
    if item.example_translation:
        details += f" ({item.example_translation})"
    return details


def _format_lesson_phrase(phrase: LessonPhrase) -> str:
    details = f"{phrase.text} means {phrase.translation}"
    if phrase.pronunciation:
        details += f" (pronounced {phrase.pronunciation})"
    if phrase.usage_note:
        details += f" (usage: {phrase.usage_note})"
    return details


async def create_agent(**_: object) -> Agent:
    """Create a new teacher instance for one call only."""

    validate_environment()

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(
            id=AGENT_USER_ID,
            name="Lingua AI Teacher",
        ),
        instructions=TEACHER_INSTRUCTIONS,
        llm=gemini.Realtime(
            model=(
                os.getenv("GEMINI_LIVE_MODEL", DEFAULT_GEMINI_LIVE_MODEL).strip()
                or DEFAULT_GEMINI_LIVE_MODEL
            ),
            config={
                "speech_config": {
                    "voice_config": {
                        "prebuilt_voice_config": {
                            "voice_name": (
                                os.getenv(
                                    "GEMINI_LIVE_VOICE",
                                    DEFAULT_GEMINI_LIVE_VOICE,
                                ).strip()
                                or DEFAULT_GEMINI_LIVE_VOICE
                            )
                        }
                    },
                    "language_code": "en-US",
                }
            },
        ),
        processors=[],
        multi_speaker_filter=SingleLearnerAudioFilter(),
    )


async def read_lesson_context(call: StreamCall) -> LessonContext:
    """Read server-authored lesson metadata from an existing Stream call."""

    response = await call.get()
    return LessonContext.from_custom(response.data.call.custom)


async def join_call(
    agent: Agent,
    call_type: str,
    call_id: str,
    **_: object,
) -> None:
    """Join an existing audio lesson and stay until the Stream call ends."""

    try:
        if call_type != "audio_room":
            raise ValueError(
                f"Lingua teachers can only join 'audio_room' calls, not '{call_type}'."
            )

        call = cast(StreamCall, await agent.create_call(call_type, call_id))
        lesson_context = await read_lesson_context(call)

        logger.info(
            "Starting %s lesson %s on call %s",
            lesson_context.language_name,
            lesson_context.lesson_id,
            call_id,
        )

        async with agent.join(call, participant_wait_timeout=30.0):
            await agent.simple_response(build_kickoff_prompt(lesson_context))
            await agent.finish()
    except Exception as error:
        logger.error(
            "AI teacher session failed on call %s [%s]: %s",
            call_id,
            type(error).__name__,
            error,
        )


launcher = AgentLauncher(
    create_agent=create_agent,
    join_call=join_call,
    agent_idle_timeout=60.0,
    max_concurrent_sessions=20,
    max_sessions_per_call=1,
    max_session_duration_seconds=60 * 60,
)

runner = Runner(
    launcher,
    serve_options=ServeOptions(
        cors_allow_origins=(),
        cors_allow_methods=("GET", "POST", "DELETE"),
        cors_allow_headers=("Content-Type", "Authorization"),
        cors_allow_credentials=False,
    ),
)


if __name__ == "__main__":
    runner.cli()
