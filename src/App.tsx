import { CircularProgress, Stack } from '@mui/material';
import { useAuthBootstrap } from './implementation/auth/useAuthBootstrap';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  const { isBootstrapping } = useAuthBootstrap();

  if (isBootstrapping) {
    return (
      <Stack
        sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return <AppRoutes />;
}
