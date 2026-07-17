import { useAuth, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  type Call,
  CallingState,
  type InputDeviceStatus,
  StreamCall,
  useCallStateHooks,
} from '@stream-io/video-react-native-sdk';
import { styled } from 'nativewind';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStreamVideoConnection } from '@/components/stream-video-provider.native';
import { images } from '@/constants/images';
import { getLanguageById } from '@/data/languages';
import { getLessonById } from '@/data/lessons';
import {
  createAudioLessonCall,
  startVisionAgentSession,
  stopVisionAgentSession,
} from '@/lib/stream-api';
import { useLanguageStore } from '@/store/language-store';
import { colors } from '@/theme';
import type {
  AudioLessonCallResponse,
  VisionAgentSessionResponse,
} from '@/types/stream';

const StyledImage = styled(Image);

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface AudioControlProps {
  active?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  icon: IoniconName;
  label: string;
  onPress: () => void;
}

function AudioControl({
  active = false,
  destructive = false,
  disabled = false,
  icon,
  label,
  onPress,
}: AudioControlProps) {
  const backgroundColor = destructive
    ? '#FF4148'
    : active
      ? colors.brand.deepPurple
      : colors.neutral.background;
  const iconColor =
    destructive || active ? colors.neutral.background : '#111A3A';

  return (
    <TouchableOpacity
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: active }}
      activeOpacity={0.78}
      className="items-center gap-2"
      disabled={disabled}
      onPress={onPress}
      style={disabled ? styles.disabledControl : undefined}
    >
      <View
        className="size-14.5 items-center justify-center rounded-full"
        style={[styles.controlButton, { backgroundColor }]}
      >
        <Ionicons color={iconColor} name={icon} size={27} />
      </View>
      <Text className="font-inter-medium text-[12px] leading-4 text-white">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type AudioCallStatus =
  | 'loading'
  | 'connecting'
  | 'joined'
  | 'muted'
  | 'error'
  | 'ended';

interface AudioCallSnapshot {
  callingState: CallingState;
  isAgentConnected: boolean;
  isSpeakingWhileMuted: boolean;
  microphoneStatus: InputDeviceStatus;
  participantCount: number;
}

interface AudioCallStateObserverProps {
  agentUserId?: string;
  onChange: (snapshot: AudioCallSnapshot) => void;
}

function AudioCallStateObserver({
  agentUserId,
  onChange,
}: AudioCallStateObserverProps) {
  const { useCallCallingState, useMicrophoneState, useParticipants } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const { isSpeakingWhileMuted, optimisticStatus } = useMicrophoneState();

  useEffect(() => {
    onChange({
      callingState,
      isAgentConnected: participants.some(
        (participant) => participant.userId === agentUserId,
      ),
      isSpeakingWhileMuted,
      microphoneStatus: optimisticStatus,
      participantCount: participants.length,
    });
  }, [
    callingState,
    agentUserId,
    isSpeakingWhileMuted,
    onChange,
    optimisticStatus,
    participants,
  ]);

  return null;
}

type AgentConnectionStatus = 'idle' | 'connecting' | 'connected' | 'failed';

interface PendingAgentStart {
  done: Promise<void>;
  shouldStop: boolean;
}

interface AgentConnectionCardProps {
  canRetry: boolean;
  error?: string;
  onRetry: () => void;
  status: AgentConnectionStatus;
}

function AgentConnectionCard({
  canRetry,
  error,
  onRetry,
  status,
}: AgentConnectionCardProps) {
  const isConnecting = status === 'connecting';
  const color =
    status === 'connected'
      ? '#16C516'
      : status === 'failed'
        ? '#FF4148'
        : status === 'connecting'
          ? colors.brand.deepPurple
          : '#7D86A1';
  const label =
    status === 'connected'
      ? 'Connected'
      : status === 'failed'
        ? 'Failed'
        : status === 'connecting'
          ? 'Connecting'
          : 'Idle';
  const description =
    status === 'connected'
      ? 'Your AI teacher is in the room and ready to speak.'
      : status === 'failed'
        ? (error ?? 'The AI teacher could not join this lesson.')
        : status === 'connecting'
          ? 'Your AI teacher is joining the Stream audio room…'
          : 'The AI teacher will join after your audio room is ready.';

  return (
    <View className="mx-4 flex-row items-center gap-3 rounded-[20px] border border-[#E8EAF1] bg-white px-4 py-3">
      <View className="size-11 items-center justify-center rounded-full bg-[#EEEAFB]">
        <Ionicons color={colors.brand.deepPurple} name="sparkles" size={22} />
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-2">
          {isConnecting ? (
            <ActivityIndicator color={color} size="small" />
          ) : (
            <View
              className="size-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
          <Text className="font-inter-semibold text-[14px] leading-5 text-text-primary">
            AI teacher • {label}
          </Text>
        </View>
        <Text
          className="mt-0.5 font-inter-regular text-[12px] leading-4.25 text-[#65708E]"
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>

      {status === 'failed' && canRetry ? (
        <TouchableOpacity
          accessibilityLabel="Retry AI teacher connection"
          accessibilityRole="button"
          activeOpacity={0.76}
          className="rounded-full bg-lingua-deep-purple px-3 py-2"
          onPress={onRetry}
        >
          <Text className="font-inter-semibold text-[11px] text-white">
            Retry
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

interface CallStatusCardProps {
  error?: string;
  isSpeakingWhileMuted: boolean;
  onBack: () => void;
  onRetry: () => void;
  participantCount: number;
  status: AudioCallStatus;
  userImage?: string;
  userName: string;
}

function CallStatusCard({
  error,
  isSpeakingWhileMuted,
  onBack,
  onRetry,
  participantCount,
  status,
  userImage,
  userName,
}: CallStatusCardProps) {
  const isBusy = status === 'loading' || status === 'connecting';
  const isLive = status === 'joined' || status === 'muted';
  const title =
    status === 'loading'
      ? 'Preparing audio lesson'
      : status === 'connecting'
        ? 'Joining Stream audio'
        : status === 'joined'
          ? 'Audio lesson joined'
          : status === 'muted'
            ? 'Microphone muted'
            : status === 'ended'
              ? 'Audio lesson ended'
              : 'Could not join audio';
  const description =
    status === 'error'
      ? (error ?? 'Check your connection and try joining the lesson again.')
      : isSpeakingWhileMuted
        ? "You're speaking while muted. Tap Mic to unmute."
        : isLive
          ? `${participantCount || 1} participant${participantCount === 1 ? '' : 's'} connected as ${userName}`
          : status === 'ended'
            ? 'Your microphone is off and the Stream session is closed.'
            : 'Securing your Clerk session and lesson room…';
  const dotColor =
    status === 'joined'
      ? '#16C516'
      : status === 'muted'
        ? '#F0A000'
        : status === 'error'
          ? '#FF4148'
          : status === 'ended'
            ? '#7D86A1'
            : colors.brand.deepPurple;

  return (
    <View className="mx-4 min-h-19 flex-row items-center gap-3 rounded-[20px] border border-[#E8EAF1] bg-white px-4 py-3">
      <View className="size-11 overflow-hidden rounded-full bg-[#EEEAFB]">
        {userImage ? (
          <StyledImage
            accessibilityLabel={`${userName}'s profile photo`}
            className="size-full"
            contentFit="cover"
            source={{ uri: userImage }}
          />
        ) : (
          <View className="size-full items-center justify-center">
            <Ionicons color={colors.brand.deepPurple} name="person" size={22} />
          </View>
        )}
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-2">
          <View className="size-5 items-center justify-center">
            {isBusy ? (
              <ActivityIndicator color={dotColor} size="small" />
            ) : (
              <View
                className="size-2.5 rounded-full"
                style={{ backgroundColor: dotColor }}
              />
            )}
          </View>
          <Text className="font-inter-semibold text-[14px] leading-5 text-text-primary">
            {title}
          </Text>
        </View>
        <Text
          className="mt-0.5 font-inter-regular text-[12px] leading-4.25 text-[#65708E]"
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>

      {status === 'error' || status === 'ended' ? (
        <View className="items-end gap-2">
          <TouchableOpacity
            accessibilityLabel={status === 'ended' ? 'Start lesson again' : 'Retry audio lesson'}
            accessibilityRole="button"
            activeOpacity={0.76}
            className="rounded-full bg-lingua-deep-purple px-3 py-2"
            onPress={onRetry}
          >
            <Text className="font-inter-semibold text-[11px] text-white">
              {status === 'ended' ? 'Restart' : 'Retry'}
            </Text>
          </TouchableOpacity>
          {status === 'ended' ? (
            <TouchableOpacity
              accessibilityLabel="Back to lessons"
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={onBack}
            >
              <Text className="font-inter-medium text-[11px] text-[#65708E]">
                Done
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

interface FeedbackItemProps {
  colorClassName: string;
  label: string;
  value: string;
}

function FeedbackItem({
  colorClassName,
  label,
  value,
}: FeedbackItemProps) {
  return (
    <View className="min-w-0 flex-1 items-center gap-2 px-2">
      <Text className="text-center font-inter-medium text-[13px] leading-4.5 text-text-primary">
        {label}
      </Text>
      <Text
        className={`text-center font-inter-medium text-[13px] leading-4.5 ${colorClassName}`}
      >
        {value}
      </Text>
    </View>
  );
}

export function AudioLessonScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const getTokenRef = useRef(getToken);
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const {
    client,
    error: connectionError,
    retry: retryConnection,
    status: connectionStatus,
  } = useStreamVideoConnection();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = useMemo(
    () => getLessonById(Array.isArray(lessonId) ? lessonId[0] : lessonId),
    [lessonId],
  );
  const language = lesson ? getLanguageById(lesson.languageId) : undefined;
  const [call, setCall] = useState<Call>();
  const [callSession, setCallSession] =
    useState<AudioLessonCallResponse>();
  const [callError, setCallError] = useState<string>();
  const [callStatus, setCallStatus] =
    useState<AudioCallStatus>('loading');
  const [isSpeakingWhileMuted, setIsSpeakingWhileMuted] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [agentConnectionError, setAgentConnectionError] = useState<string>();
  const [agentConnectionStatus, setAgentConnectionStatus] =
    useState<AgentConnectionStatus>('idle');
  const [sessionRequestId, setSessionRequestId] = useState(() =>
    Crypto.randomUUID(),
  );
  const [areSubtitlesVisible, setAreSubtitlesVisible] = useState(true);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const activeAgentSessionRef =
    useRef<VisionAgentSessionResponse | undefined>(undefined);
  const pendingAgentStartRef =
    useRef<PendingAgentStart | undefined>(undefined);
  const agentGenerationRef = useRef(0);
  const agentConnectionTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasAgentConnectedRef = useRef(false);

  getTokenRef.current = getToken;

  const getClerkToken = useCallback(() => getTokenRef.current(), []);

  const clearAgentConnectionTimeout = useCallback(() => {
    if (agentConnectionTimeoutRef.current) {
      clearTimeout(agentConnectionTimeoutRef.current);
      agentConnectionTimeoutRef.current = undefined;
    }
  }, []);

  const stopAgentSession = useCallback(
    async (showIdle = true) => {
      const stopGeneration = ++agentGenerationRef.current;
      const pendingStart = pendingAgentStartRef.current;
      const activeSession = activeAgentSessionRef.current;

      clearAgentConnectionTimeout();
      hasAgentConnectedRef.current = false;
      activeAgentSessionRef.current = undefined;

      if (pendingStart) {
        pendingStart.shouldStop = true;
      }

      const cleanupTasks: Promise<unknown>[] = [];

      if (activeSession) {
        cleanupTasks.push(
          stopVisionAgentSession({
            callId: activeSession.callId,
            getToken: getClerkToken,
            sessionId: activeSession.sessionId,
          }).catch((error: unknown) => {
            console.error('Failed to stop Vision Agent session', error);
          }),
        );
      }

      if (pendingStart) {
        cleanupTasks.push(pendingStart.done);
      }

      await Promise.all(cleanupTasks);

      if (showIdle && agentGenerationRef.current === stopGeneration) {
        setAgentConnectionError(undefined);
        setAgentConnectionStatus('idle');
      }
    },
    [clearAgentConnectionTimeout, getClerkToken],
  );

  const startAgentSession = useCallback(
    async (callId: string) => {
      if (activeAgentSessionRef.current || pendingAgentStartRef.current) {
        await stopAgentSession(false);
      }

      const generation = ++agentGenerationRef.current;
      const pendingStart: PendingAgentStart = {
        done: Promise.resolve(),
        shouldStop: false,
      };

      clearAgentConnectionTimeout();
      hasAgentConnectedRef.current = false;
      setAgentConnectionError(undefined);
      setAgentConnectionStatus('connecting');

      pendingStart.done = (async () => {
        try {
          const session = await startVisionAgentSession({
            callId,
            getToken: getClerkToken,
          });

          if (
            pendingStart.shouldStop ||
            agentGenerationRef.current !== generation
          ) {
            await stopVisionAgentSession({
              callId: session.callId,
              getToken: getClerkToken,
              sessionId: session.sessionId,
            }).catch((error: unknown) => {
              console.error('Failed to stop late Vision Agent session', error);
            });
            return;
          }

          activeAgentSessionRef.current = session;

          if (hasAgentConnectedRef.current) {
            setAgentConnectionStatus('connected');
            return;
          }

          agentConnectionTimeoutRef.current = setTimeout(() => {
            if (agentGenerationRef.current !== generation) return;

            setAgentConnectionError(
              'The AI teacher did not enter the audio room in time.',
            );
            setAgentConnectionStatus('failed');
            void stopAgentSession(false);
          }, 30_000);
        } catch (error) {
          if (
            pendingStart.shouldStop ||
            agentGenerationRef.current !== generation
          ) {
            return;
          }

          setAgentConnectionError(
            error instanceof Error
              ? error.message
              : 'The AI teacher could not join this lesson.',
          );
          setAgentConnectionStatus('failed');
        } finally {
          if (pendingAgentStartRef.current === pendingStart) {
            pendingAgentStartRef.current = undefined;
          }
        }
      })();

      pendingAgentStartRef.current = pendingStart;
      await pendingStart.done;
    },
    [
      clearAgentConnectionTimeout,
      getClerkToken,
      stopAgentSession,
    ],
  );

  useEffect(() => {
    if (!lesson || !language) return;

    if (connectionStatus !== 'ready' || !client) {
      return;
    }

    let cancelled = false;
    let activeCall: Call | undefined;

    setCall(undefined);
    setCallSession(undefined);
    setCallError(undefined);
    setCallStatus('loading');
    setParticipantCount(0);
    setAgentConnectionError(undefined);
    setAgentConnectionStatus('idle');

    (async () => {
      const callSession = await createAudioLessonCall({
        getToken: getClerkToken,
        languageId: selectedLanguageId ?? language.id,
        lessonId: lesson.id,
        requestId: sessionRequestId,
      });

      if (cancelled) return;

      setCallSession(callSession);

      const createdCall = client.call(callSession.callType, callSession.callId, {
        reuseInstance: true,
      });
      activeCall = createdCall;
      createdCall.setDisconnectionTimeout(120);
      setCall(createdCall);
      setCallStatus('connecting');

      await createdCall.join({ maxJoinRetries: 1 });

      if (cancelled) {
        if (createdCall.state.callingState !== CallingState.LEFT) {
          await createdCall.leave();
        }
        return;
      }

      await createdCall.camera.disable();
      await createdCall.microphone.enable();
      setCallStatus('joined');
      void startAgentSession(callSession.callId);
    })().catch((error: unknown) => {
      if (cancelled) return;

      if (
        activeCall &&
        activeCall.state.callingState !== CallingState.LEFT
      ) {
        activeCall.leave().catch((leaveError: unknown) => {
          console.error('Failed to leave audio lesson after error', leaveError);
        });
      }

      setCallError(
        error instanceof Error
          ? error.message
          : 'Could not start this audio lesson.',
      );
      setCallStatus('error');
    });

    return () => {
      cancelled = true;
      setCall(undefined);
      setCallSession(undefined);
      void stopAgentSession(false);

      if (
        activeCall &&
        activeCall.state.callingState !== CallingState.LEFT
      ) {
        activeCall.leave().catch((error: unknown) => {
          console.error('Failed to leave audio lesson', error);
        });
      }
    };
  }, [
    client,
    connectionStatus,
    getClerkToken,
    language,
    lesson,
    selectedLanguageId,
    sessionRequestId,
    startAgentSession,
    stopAgentSession,
  ]);

  const handleCallStateChange = useCallback(
    ({
      callingState,
      isAgentConnected,
      isSpeakingWhileMuted: isSpeaking,
      microphoneStatus,
      participantCount: nextParticipantCount,
    }: AudioCallSnapshot) => {
      setIsSpeakingWhileMuted(isSpeaking);
      setParticipantCount(nextParticipantCount);

      if (isAgentConnected) {
        hasAgentConnectedRef.current = true;
        clearAgentConnectionTimeout();
        setAgentConnectionError(undefined);
        setAgentConnectionStatus('connected');
      } else if (
        hasAgentConnectedRef.current &&
        callingState === CallingState.JOINED &&
        activeAgentSessionRef.current
      ) {
        hasAgentConnectedRef.current = false;
        setAgentConnectionError('The AI teacher left the audio room.');
        setAgentConnectionStatus('failed');
        void stopAgentSession(false);
      }

      switch (callingState) {
        case CallingState.JOINED:
          setCallStatus(
            microphoneStatus === 'enabled' ? 'joined' : 'muted',
          );
          return;

        case CallingState.UNKNOWN:
        case CallingState.IDLE:
        case CallingState.RINGING:
        case CallingState.JOINING:
        case CallingState.RECONNECTING:
        case CallingState.MIGRATING:
        case CallingState.OFFLINE:
          setCallStatus('connecting');
          return;

        case CallingState.RECONNECTING_FAILED:
          setCallError('The audio connection was lost. Please retry.');
          setCallStatus('error');
          return;

        case CallingState.LEFT:
          setCallStatus((current) =>
            current === 'error' ? current : 'ended',
          );
          return;

        default: {
          const unsupportedState: never = callingState;
          setCallError(`Unsupported audio state: ${unsupportedState}`);
          setCallStatus('error');
        }
      }
    },
    [clearAgentConnectionTimeout, stopAgentSession],
  );

  const handleToggleMicrophone = useCallback(async () => {
    if (!call || call.state.callingState !== CallingState.JOINED) return;

    try {
      setCallError(undefined);
      await call.microphone.toggle();
    } catch (error) {
      setCallError(
        error instanceof Error
          ? error.message
          : 'Could not change the microphone state.',
      );
    }
  }, [call]);

  const handleEndLesson = useCallback(async () => {
    if (!call) {
      await stopAgentSession();
      router.back();
      return;
    }

    try {
      const leaveCall =
        call.state.callingState !== CallingState.LEFT
          ? call.leave()
          : Promise.resolve();

      await Promise.all([leaveCall, stopAgentSession()]);

      setCallError(undefined);
      setCallStatus('ended');
    } catch (error) {
      setCallError(
        error instanceof Error
          ? error.message
          : 'Could not end the audio lesson.',
      );
      setCallStatus('error');
    }
  }, [call, router, stopAgentSession]);

  const handleRetry = useCallback(async () => {
    await stopAgentSession(false);

    if (connectionStatus === 'error') {
      retryConnection();
    }

    setCallError(undefined);
    setCallStatus('loading');
    setSessionRequestId(Crypto.randomUUID());
  }, [connectionStatus, retryConnection, stopAgentSession]);

  const handleRetryAgent = useCallback(async () => {
    if (
      !callSession ||
      !call ||
      call.state.callingState !== CallingState.JOINED
    ) {
      return;
    }

    await stopAgentSession(false);
    void startAgentSession(callSession.callId);
  }, [call, callSession, startAgentSession, stopAgentSession]);

  if (!lesson || !language) {
    return <Redirect href="/learn" />;
  }

  const currentPhrase = lesson.phrases[phraseIndex] ?? lesson.phrases[0];
  const sessionContext =
    currentPhrase?.translation ??
    lesson.goal.outcomes[0] ??
    lesson.description;

  const handleTeacherPlayback = () => {
    setIsTeacherSpeaking((isSpeaking) => !isSpeaking);

    if (lesson.phrases.length > 1) {
      setPhraseIndex(
        (currentIndex) => (currentIndex + 1) % lesson.phrases.length,
      );
    }
  };

  const visibleCallError =
    connectionStatus === 'error' ? connectionError : callError;
  const visibleCallStatus: AudioCallStatus = visibleCallError
    ? 'error'
    : connectionStatus !== 'ready'
      ? 'loading'
      : callStatus;
  const isMicEnabled = visibleCallStatus === 'joined';
  const isCallActive =
    visibleCallStatus === 'joined' || visibleCallStatus === 'muted';
  const statusLabel =
    visibleCallStatus === 'joined'
      ? 'Joined'
      : visibleCallStatus === 'muted'
        ? 'Muted'
        : visibleCallStatus === 'connecting'
          ? 'Connecting'
          : visibleCallStatus === 'loading'
            ? 'Loading'
            : visibleCallStatus === 'ended'
              ? 'Ended'
              : 'Error';
  const statusDotColor =
    visibleCallStatus === 'joined'
      ? '#16C516'
      : visibleCallStatus === 'error'
        ? '#FF4148'
        : visibleCallStatus === 'muted'
          ? '#F0A000'
          : '#7D86A1';
  const userName =
    user?.fullName ??
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    'Lingua learner';

  const screen = (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.neutral.background} style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="h-[102px] flex-row items-center px-4">
          <TouchableOpacity
            accessibilityLabel="Back to lessons"
            accessibilityRole="button"
            activeOpacity={0.7}
            className="size-12 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons color="#111A36" name="chevron-back" size={33} />
          </TouchableOpacity>

          <View className="min-w-0 flex-1 gap-1 pl-1">
            <Text className="font-inter-semibold text-[22px] leading-7 text-text-primary">
              AI Teacher
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className="size-3 rounded-full"
                style={{ backgroundColor: statusDotColor }}
              />
              <Text
                className="min-w-0 flex-1 font-inter-regular text-[13px] leading-[18px] text-[#65708E]"
                numberOfLines={1}
              >
                {statusLabel} • {language.name} • {lesson.title}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className="size-11 items-center justify-center rounded-full border border-[#E6E8EF] bg-white">
              <Ionicons color="#111A36" name="headset-outline" size={23} />
            </View>
            <View className="size-11 items-center justify-center rounded-full border border-[#E6E8EF] bg-white">
              <Text
                className="font-inter-medium text-[17px] text-text-primary"
                style={styles.tabularNumbers}
              >
                {lesson.durationMinutes}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-3 h-[598px] overflow-hidden rounded-[25px] bg-[#C7C1BE]">
          <StyledImage
            accessibilityLabel="AI teacher lesson room"
            className="absolute inset-x-0 top-0 h-[430px] w-full"
            contentFit="cover"
            source={images.audioLessonRoom}
          />
          <View className="absolute inset-0 bg-[#3D332C]/20" />
          <View className="absolute inset-x-0 bottom-0 h-[250px] bg-[#B8B1B1]/75" />

          <View className="absolute left-4 top-4 max-w-[61%] rounded-full bg-black/35 px-4 py-2">
            <Text
              className="font-inter-medium text-[12px] leading-[17px] text-white"
              numberOfLines={1}
            >
              Goal: {lesson.goal.summary}
            </Text>
          </View>

          <StyledImage
            accessibilityLabel="Lingua AI teacher"
            className="absolute -left-5 top-[63px] size-[350px]"
            contentFit="contain"
            source={images.mascotAuth}
          />

          <View className="absolute right-4 top-5 h-[132px] w-[106px] overflow-hidden rounded-[22px] border-[3px] border-white bg-[#E8E1D9]">
            <StyledImage
              accessibilityLabel="Learner preview"
              className="size-full"
              contentFit="cover"
              source={
                user?.imageUrl
                  ? { uri: user.imageUrl }
                  : images.audioLessonLearner
              }
            />
          </View>

          <View className="absolute right-4 top-[158px] max-w-[106px] rounded-full bg-black/40 px-3 py-1.5">
            <Text
              className="text-center font-inter-medium text-[10px] text-white"
              numberOfLines={1}
            >
              {userName}
            </Text>
          </View>

          <View className="absolute bottom-[199px] left-[82px] right-[72px] min-h-[104px] justify-center rounded-[20px] bg-white px-5 py-4" style={styles.speechBubble}>
            {areSubtitlesVisible ? (
              <>
                <Text
                  className="pr-9 font-inter-medium text-[17px] leading-6 text-text-primary"
                  numberOfLines={2}
                  selectable
                >
                  {currentPhrase?.text ?? lesson.teacherOpeningLine}
                </Text>
                <Text
                  className="mt-1 pr-8 font-inter-regular text-[13px] leading-[18px] text-[#65708E]"
                  numberOfLines={2}
                  selectable
                >
                  {sessionContext} 👏
                </Text>
              </>
            ) : (
              <Text className="pr-8 font-inter-medium text-[16px] leading-6 text-text-primary">
                Listen closely to your AI teacher…
              </Text>
            )}

            <TouchableOpacity
              accessibilityLabel={
                isTeacherSpeaking ? 'Pause teacher' : 'Play teacher response'
              }
              accessibilityRole="button"
              activeOpacity={0.72}
              className="absolute right-3 top-1/2 size-10 -translate-y-1/2 items-center justify-center"
              onPress={handleTeacherPlayback}
            >
              <Ionicons
                color={colors.brand.deepPurple}
                name={isTeacherSpeaking ? 'pause' : 'volume-high'}
                size={27}
              />
            </TouchableOpacity>
            <View style={styles.speechBubbleTail} />
          </View>

          <View className="absolute inset-x-0 bottom-[102px] flex-row items-start justify-around px-3">
            <AudioControl
              active={isTeacherSpeaking}
              icon={isTeacherSpeaking ? 'pause' : 'volume-high'}
              label="Audio"
              onPress={handleTeacherPlayback}
            />
            <AudioControl
              active={isMicEnabled}
              disabled={!isCallActive}
              icon={isMicEnabled ? 'mic' : 'mic-off'}
              label={isMicEnabled ? 'Mic' : 'Muted'}
              onPress={handleToggleMicrophone}
            />
            <AudioControl
              active={areSubtitlesVisible}
              icon="language"
              label="Subtitles"
              onPress={() => setAreSubtitlesVisible((isVisible) => !isVisible)}
            />
            <AudioControl
              destructive
              icon="call"
              label="End Lesson"
              onPress={handleEndLesson}
            />
          </View>

          <View className="absolute inset-x-5 bottom-4 h-[78px] flex-row items-center rounded-[22px] bg-white px-2">
            <FeedbackItem
              colorClassName="text-[#16C516]"
              label="Speaking"
              value="Excellent"
            />
            <View className="h-12 w-px bg-[#E4E7EF]" />
            <FeedbackItem
              colorClassName="text-[#2685FF]"
              label="Pronunciation"
              value="Great"
            />
            <View className="h-12 w-px bg-[#E4E7EF]" />
            <FeedbackItem
              colorClassName="text-lingua-deep-purple"
              label="Grammar"
              value="Good"
            />
          </View>
        </View>

        <CallStatusCard
          error={visibleCallError}
          isSpeakingWhileMuted={isSpeakingWhileMuted}
          onBack={() => router.back()}
          onRetry={handleRetry}
          participantCount={participantCount}
          status={visibleCallStatus}
          userImage={user?.imageUrl}
          userName={userName}
        />

        <AgentConnectionCard
          canRetry={isCallActive}
          error={agentConnectionError}
          onRetry={handleRetryAgent}
          status={agentConnectionStatus}
        />

        <View className="mx-4 gap-3 rounded-[22px] border border-[#EEF0F5] bg-white p-5">
          <View className="flex-row items-center gap-3">
            <StyledImage
              accessibilityLabel={`${language.name} flag`}
              className="size-9 rounded-full"
              contentFit="cover"
              source={{ uri: language.flagEmoji }}
            />
            <View className="min-w-0 flex-1">
              <Text className="font-inter-semibold text-[16px] leading-5 text-text-primary">
                {lesson.title}
              </Text>
              <Text className="font-inter-regular text-[12px] leading-[17px] text-[#65708E]">
                {language.name} • {lesson.level} • {lesson.xpReward} XP
              </Text>
            </View>
          </View>

          <View className="gap-1">
            <Text className="font-inter-semibold text-[13px] leading-[18px] text-text-primary">
              AI teacher context
            </Text>
            <Text
              className="font-inter-regular text-[13px] leading-5 text-[#65708E]"
              selectable
            >
              {lesson.teacherOpeningLine}
            </Text>
          </View>

          <View className="gap-1">
            <Text className="font-inter-semibold text-[13px] leading-[18px] text-text-primary">
              Lesson goal
            </Text>
            <Text
              className="font-inter-regular text-[13px] leading-5 text-[#65708E]"
              selectable
            >
              {lesson.goal.summary}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return call ? (
    <StreamCall call={call}>
      <AudioCallStateObserver
        agentUserId={callSession?.agentUserId}
        onChange={handleCallStateChange}
      />
      {screen}
    </StreamCall>
  ) : (
    screen
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 18,
  },
  controlButton: {
    borderCurve: 'circular',
    boxShadow: '0 4px 10px rgba(20, 27, 55, 0.12)',
  },
  disabledControl: {
    opacity: 0.48,
  },
  speechBubble: {
    borderCurve: 'continuous',
    boxShadow: '0 5px 14px rgba(20, 27, 55, 0.18)',
  },
  speechBubbleTail: {
    position: 'absolute',
    right: 22,
    bottom: -14,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 0,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.neutral.background,
  },
  tabularNumbers: {
    fontVariant: ['tabular-nums'],
  },
});
