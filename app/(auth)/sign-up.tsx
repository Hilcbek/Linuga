import { AuthScreen } from '@/components/auth-screen';
import { useSignUp } from '@clerk/expo';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) throw new Error(error.message);

    const verification = await signUp.verifications.sendEmailCode();
    if (verification.error) throw new Error(verification.error.message);

    return { requiresVerification: true };
  };

  const handleVerify = async (code: string) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) throw new Error(error.message);
    if (signUp.status !== 'complete') throw new Error('Verification could not be completed.');

    await signUp.finalize();
    router.replace('/');
  };

  return <AuthScreen mode="sign-up" onSubmit={handleSubmit} onVerify={handleVerify} />;
}
