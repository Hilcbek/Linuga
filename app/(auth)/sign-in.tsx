import { AuthScreen } from '@/components/auth-screen';
import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) throw new Error(error.message);

    if (signIn.status !== 'complete') throw new Error('Sign in could not be completed.');

    await signIn.finalize();
    router.replace('/');

    return { requiresVerification: false };
  };

  return <AuthScreen mode="sign-in" onSubmit={handleSubmit} />;
}
