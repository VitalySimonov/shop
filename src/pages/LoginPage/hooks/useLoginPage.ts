import { useAuthStore } from '../../../implementation/auth/authStore';
import { useLoginForm } from './useLoginForm';
import { useLoginMutation } from './useLoginMutation';
import { useRedirectIfAuthenticated } from './useRedirectIfAuthenticated';

export function useLoginPage() {
  useRedirectIfAuthenticated();
  const { form, showPassword, setShowPassword } = useLoginForm();
  const setRememberMe = useAuthStore((state) => state.setRememberMe);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const { loginMutation, submitErrorMessage, isPending } = useLoginMutation();

  const handleFormSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return {
    form,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    isSubmitting: isPending,
    submitErrorMessage,
    handleFormSubmit,
  };
}
