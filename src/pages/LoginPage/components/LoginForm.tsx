import type { UseFormReturn } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import personIcon from '../../../assets/person.svg';
import crossIcon from '../../../assets/cross.svg';
import lockIcon from '../../../assets/lock.svg';
import eyeIcon from '../../../assets/eye.svg';
import eyeOffIcon from '../../../assets/eye-off.svg';
import loginIcon from '../../../assets/login.svg';
import type { ILoginFormValues } from '../hooks/useLoginForm';

export interface ILoginFormProps {
  form: Pick<UseFormReturn<ILoginFormValues>, 'register' | 'handleSubmit' | 'reset' | 'formState'>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  rememberMe: boolean;
  setRememberMe: (rememberMe: boolean) => void;
  isSubmitting: boolean;
  submitErrorMessage: string | null;
  onFormSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function LoginForm({
  form,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  isSubmitting,
  submitErrorMessage,
  onFormSubmit,
}: ILoginFormProps) {
  const { register, reset, formState } = form;
  const { errors } = formState;
  const { ref: usernameInputRef, ...usernameField } = register('username');
  const { ref: passwordInputRef, ...passwordField } = register('password');

  const loginTextFieldSx = {
    '& .MuiOutlinedInput-root': {
      height: 55,
      borderRadius: '12px',
      px: '14px',
      py: 0,
      backgroundColor: 'var(--color-white)',
      '& fieldset': { borderColor: 'var(--color-gray-200)', borderWidth: '1.5px' },
      '&:hover fieldset': { borderColor: 'var(--color-gray-200)' },
      '&.Mui-focused fieldset': { borderColor: 'var(--color-blue-700)', borderWidth: '1.5px' },
    },
    '&.Mui-error .MuiOutlinedInput-root fieldset': { borderColor: 'var(--color-red)' },
    '& .MuiInputAdornment-root': { margin: 0 },
    '& .MuiInputAdornment-positionStart': { mr: '14px' },
    // `ml` = gap between text and icon, `mr` = gap from right edge of the field.
    '& .MuiInputAdornment-positionEnd': { ml: '14px', mr: '14px' },
    // MUI can override padding on adorned inputs, so force the outer right padding too.
    '& .MuiOutlinedInput-root.MuiOutlinedInput-adornedEnd': { pr: '14px' },
    '& .MuiOutlinedInput-root input': {
      py: 0,
      fontSize: 18,
      lineHeight: '27px',
      letterSpacing: '-0.015em',
      color: 'var(--color-gray-900)',
      fontWeight: 500,
      fontFamily: 'var(--font-inter)',
      '&::placeholder': { color: 'var(--color-gray-400)', opacity: 1 },
    },
    '& .MuiOutlinedInput-root input:-webkit-autofill, & .MuiOutlinedInput-root input:-webkit-autofill:hover, & .MuiOutlinedInput-root input:-webkit-autofill:focus, & .MuiOutlinedInput-root input:-webkit-autofill:active':
      {
        WebkitBoxShadow: '0 0 0 1000px var(--color-white) inset',
        WebkitTextFillColor: 'var(--color-gray-900)',
        caretColor: 'var(--color-gray-900)',
        transition: 'background-color 9999s ease-out 0s',
      },
    '& .MuiIconButton-root': { p: '4px', color: 'var(--color-gray-400)' },
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'transparent',
      color: 'var(--color-gray-700)',
    },
  } as const;

  const fieldLabelSx = {
    fontFamily: 'var(--font-inter)',
    fontSize: 18,
    lineHeight: '27px',
    letterSpacing: '-0.015em',
    color: 'var(--color-gray-900)',
    fontWeight: 500,
  } as const;

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'var(--color-bg-app)', px: 2 }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: 527 },
          maxWidth: 527,
          minHeight: { xs: 'auto', sm: 716 },
          borderRadius: '40px',
          background: 'var(--color-white)',
          boxShadow: '0px 24px 32px var(--overlay-black-04)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: '6px',
          gap: '32px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 515,
            minHeight: { xs: 'auto', sm: 704 },
            borderRadius: '34px',
            background:
              'linear-gradient(180deg, var(--color-gray-000) 0%, var(--color-white) 50%) padding-box, linear-gradient(180deg, var(--color-gray-200) 0%, var(--overlay-gray-00) 100%) border-box',
            p: { xs: 3, sm: 6 },
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            border: '2px solid transparent',
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background:
                'linear-gradient(360deg, var(--overlay-gray-00) 50%, var(--overlay-gray-06) 100%), var(--color-white)',
              boxShadow: '0px 0px 0px 2px var(--color-white), 0px 12px 8px var(--overlay-black-03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={loginIcon}
              alt=""
              sx={{ width: 34, height: 34, display: 'block' }}
            />
          </Box>

          <Stack sx={{ width: '100%', maxWidth: 419, gap: '12px', alignItems: 'center' }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: { xs: 32, sm: 40 },
                lineHeight: { xs: '38px', sm: '44px' },
                letterSpacing: '-0.015em',
                color: 'var(--color-gray-900)',
                textAlign: 'center',
              }}
            >
              Добро пожаловать!
            </Typography>
            <Typography
              sx={{
                width: '100%',
                fontFamily: 'var(--font-inter)',
                fontWeight: 500,
                fontSize: 18,
                lineHeight: '27px',
                color: 'transparent',
                background:
                  'linear-gradient(0deg, var(--color-gray-100) 0%, var(--overlay-black-30) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                textAlign: 'center',
              }}
            >
              Пожалуйста, авторизируйтесь
            </Typography>
          </Stack>

          <Stack
            component="form"
            noValidate
            onSubmit={onFormSubmit}
            sx={{ width: '100%', maxWidth: 399, flex: 1, gap: '20px' }}
          >
            <Stack sx={{ gap: '16px' }}>
              <Stack sx={{ gap: '6px' }}>
                <Typography sx={fieldLabelSx}>Логин</Typography>
                <TextField
                  fullWidth
                  sx={loginTextFieldSx}
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
                  FormHelperTextProps={{
                    sx: { pl: '14px', pr: '14px', mx: 0, mt: 0.5, fontFamily: 'var(--font-inter)' },
                  }}
                  {...usernameField}
                  inputRef={usernameInputRef}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          component="img"
                          sx={{ width: 24, height: 24 }}
                          src={personIcon}
                          alt=""
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          edge="end"
                          aria-label="Очистить форму"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => reset({ username: '', password: '' })}
                        >
                          <Box
                            component="img"
                            sx={{ width: 16, height: 16 }}
                            src={crossIcon}
                            alt=""
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Stack sx={{ gap: '6px' }}>
                <Typography sx={fieldLabelSx}>Пароль</Typography>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  sx={loginTextFieldSx}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  FormHelperTextProps={{
                    sx: { pl: '14px', pr: '14px', mx: 0, mt: 0.5, fontFamily: 'var(--font-inter)' },
                  }}
                  {...passwordField}
                  inputRef={passwordInputRef}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="img" sx={{ width: 24, height: 24 }} src={lockIcon} alt="" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          edge="end"
                          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          <Box
                            component="img"
                            sx={{ width: 20, height: 20 }}
                            src={showPassword ? eyeIcon : eyeOffIcon}
                            alt=""
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            {submitErrorMessage ? (
              <Alert
                severity="error"
                sx={{ boxSizing: 'border-box', width: '100%', fontFamily: 'var(--font-inter)' }}
              >
                {submitErrorMessage}
              </Alert>
            ) : null}

            <FormControlLabel
              sx={{ m: 0, alignItems: 'center', ml: '-2px' }}
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(event) => {
                    setRememberMe(event.target.checked);
                  }}
                  sx={{
                    p: 0,
                    mr: '10px',
                    width: 24,
                    height: 24,
                    color: 'var(--color-gray-300)',
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    },
                    '&.Mui-checked': { color: 'var(--color-blue-900)' },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 16,
                    lineHeight: '24px',
                    color: 'var(--color-gray-500)',
                    fontWeight: 500,
                  }}
                >
                  Запомнить данные
                </Typography>
              }
            />

            <Stack sx={{ gap: '16px' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{
                  height: 54,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  fontSize: 18,
                  lineHeight: '22px',
                  letterSpacing: '-0.01em',
                  color: 'var(--color-white)',
                  border: '1px solid var(--color-blue-700)',
                  background:
                    'linear-gradient(0deg, var(--overlay-white-00) 0%, var(--overlay-white-12) 100%), var(--color-blue-900)',
                  boxShadow:
                    '0px 8px 8px var(--overlay-blue), inset 0px -2px 0px 1px var(--overlay-black-08)',
                  '&:hover': {
                    background:
                      'linear-gradient(0deg, var(--overlay-white-00) 0%, var(--overlay-white-12) 100%), var(--color-blue-700)',
                    borderColor: 'var(--color-blue-700)',
                    boxShadow:
                      '0px 8px 8px var(--overlay-blue), inset 0px -2px 0px 1px var(--overlay-black-08)',
                  },
                  '&:disabled': {
                    color: 'var(--color-white)',
                    opacity: 0.7,
                  },
                }}
              >
                Войти
              </Button>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px' }}>
                <Box sx={{ flex: 1, borderTop: '1px solid var(--color-gray-200)' }} />
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: 16,
                    lineHeight: '24px',
                    color: 'var(--color-gray-400)',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  или
                </Typography>
                <Box sx={{ flex: 1, borderTop: '1px solid var(--color-gray-200)' }} />
              </Box>
            </Stack>
            <Typography
              sx={{
                width: '100%',
                textAlign: 'center',
                fontFamily: 'var(--font-inter)',
                fontSize: 18,
                lineHeight: '27px',
                color: 'var(--color-gray-700)',
                fontWeight: 400,
              }}
            >
              Нет аккаунта?{' '}
              <Box
                component="a"
                href="#"
                sx={{
                  borderBottom: '1px solid var(--color-blue-900)',
                  fontWeight: 600,
                  color: 'var(--color-blue-900)',
                  textDecoration: 'none',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                Создать
              </Box>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
