from __future__ import annotations

import asyncio
import os
import unittest
from unittest.mock import AsyncMock, MagicMock, patch

from agent import (
    AGENT_USER_ID,
    DEFAULT_GEMINI_LIVE_MODEL,
    LessonContext,
    LessonContextError,
    build_kickoff_prompt,
    create_agent,
    join_call,
)


def lesson_custom_data() -> dict[str, object]:
    return {
        "language_id": "spanish",
        "language_code": "es",
        "language_locale": "es-ES",
        "language_name": "Spanish",
        "language_native_name": "Español",
        "lesson_id": "spanish-greetings",
        "lesson_title": "Everyday greetings",
        "lesson_description": "Greet someone and introduce yourself.",
        "lesson_level": "A1",
        "lesson_format": "ai-audio",
        "lesson_goal": {
            "summary": "Introduce yourself in Spanish.",
            "outcomes": ["Say hello.", "Tell someone your name."],
        },
        "lesson_vocabulary": [
            {
                "term": "hola",
                "translation": "hello",
                "pronunciation": "OH-lah",
            }
        ],
        "lesson_phrases": [
            {
                "text": "Me llamo Alex.",
                "translation": "My name is Alex.",
                "pronunciation": "meh YAH-moh Alex",
            }
        ],
        "teacher_opening_line": "¡Hola! Let's introduce ourselves.",
        "ai_teacher_prompt": "Teach greetings and introductions at A1 level.",
    }


class LessonContextTests(unittest.TestCase):
    def test_reads_lesson_context_from_stream_custom_data(self) -> None:
        context = LessonContext.from_custom(lesson_custom_data())

        self.assertEqual(context.language_name, "Spanish")
        self.assertEqual(context.lesson_title, "Everyday greetings")
        self.assertEqual(context.goal.outcomes[1], "Tell someone your name.")
        self.assertEqual(context.vocabulary[0].term, "hola")
        self.assertEqual(context.phrases[0].text, "Me llamo Alex.")

    def test_rejects_missing_language_context(self) -> None:
        with self.assertRaises(LessonContextError):
            custom = lesson_custom_data()
            custom.pop("language_id")
            LessonContext.from_custom(custom)

    def test_kickoff_prompt_uses_the_selected_language_and_lesson(self) -> None:
        custom = lesson_custom_data()
        custom.update(
            {
                "language_id": "french",
                "language_code": "fr",
                "language_locale": "fr-FR",
                "language_name": "French",
                "language_native_name": "Français",
                "lesson_id": "french-travel",
                "lesson_title": "Travel basics",
            }
        )
        prompt = build_kickoff_prompt(LessonContext.from_custom(custom))

        self.assertIn("target language is French", prompt)
        self.assertIn("lesson is Travel basics", prompt)
        self.assertIn("Say hello", prompt)
        self.assertIn("hola means hello", prompt)
        self.assertIn("Me llamo Alex", prompt)
        self.assertIn("Teach greetings and introductions", prompt)


class AgentConfigurationTests(unittest.TestCase):
    def test_agent_is_voice_only(self) -> None:
        environment = {
            "GOOGLE_API_KEY": "test-google-key",
            "STREAM_API_KEY": "test-stream-key",
            "STREAM_API_SECRET": "test-stream-secret-with-at-least-32-bytes",
        }

        async def assert_configuration() -> None:
            teacher = await create_agent()
            try:
                self.assertEqual(teacher.agent_user.id, AGENT_USER_ID)
                self.assertTrue(teacher.publish_audio)
                self.assertFalse(teacher.publish_video)
                self.assertEqual(teacher.llm.provider_name, "gemini_realtime")
                self.assertEqual(teacher.llm.model, DEFAULT_GEMINI_LIVE_MODEL)
            finally:
                await teacher.close()

        with patch.dict(os.environ, environment, clear=False):
            asyncio.run(assert_configuration())

    def test_provider_failure_is_logged_without_escaping_the_session_task(self) -> None:
        class FailingJoinContext:
            async def __aenter__(self) -> None:
                raise RuntimeError("provider unavailable")

            async def __aexit__(self, *_: object) -> None:
                return None

        fake_agent = MagicMock()
        fake_agent.create_call = AsyncMock(return_value=object())
        fake_agent.join.return_value = FailingJoinContext()
        context = LessonContext.from_custom(lesson_custom_data())

        async def assert_failure_is_contained() -> None:
            with patch("agent.read_lesson_context", AsyncMock(return_value=context)):
                with self.assertLogs("agent", level="ERROR") as logs:
                    await join_call(fake_agent, "audio_room", "lesson-test")

            self.assertIn("provider unavailable", " ".join(logs.output))

        asyncio.run(assert_failure_is_contained())


if __name__ == "__main__":
    unittest.main()
