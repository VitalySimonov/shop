import { LoginForm } from './components/LoginForm';
import { useLoginPage } from './hooks';

export function LoginPage() {
  const login = useLoginPage();

  return (
    <LoginForm
      form={login.form}
      showPassword={login.showPassword}
      setShowPassword={login.setShowPassword}
      rememberMe={login.rememberMe}
      setRememberMe={login.setRememberMe}
      isSubmitting={login.isSubmitting}
      submitErrorMessage={login.submitErrorMessage}
      onFormSubmit={login.handleFormSubmit}
    />
  );
}
