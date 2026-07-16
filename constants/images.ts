import earth from '@/assets/images/earth.png';
import googleGLogo from '@/assets/images/google-g-logo.png';
import mascotLogo from '@/assets/images/moscot-logo.png';
import mascotAuth from '@/assets/images/mascot-auth.png';
import mascotWelcome from '@/assets/images/mascot-welcome.png';
import palace from '@/assets/images/palace.png';
import streakFire from '@/assets/images/streak-fire.png';
import treasure from '@/assets/images/treasure.png';

export const images = {
  audioLessonLearner: {
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85',
  },
  audioLessonRoom: {
    uri: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85',
  },
  aiTeacherPortrait: {
    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=85',
  },
  earth,
  googleGLogo,
  mascotAuth,
  mascotLogo,
  mascotWelcome,
  palace,
  lessonScenes: {
    cafe: {
      uri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    },
    dailyLife: {
      uri: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85',
    },
    family: {
      uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85',
    },
    greetings: {
      uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
    },
    shopping: {
      uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
    },
    travel: {
      uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
    },
  },
  streakFire,
  treasure,
} as const;
