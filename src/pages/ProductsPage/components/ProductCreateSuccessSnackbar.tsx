import { Alert, Snackbar } from '@mui/material';

interface IProductCreateSuccessSnackbarProps {
  open: boolean;
  onClose: () => void;
}

export function ProductCreateSuccessSnackbar({
  open,
  onClose,
}: IProductCreateSuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={(_, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        onClose();
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="success" variant="filled" sx={{ width: '100%' }}>
        Товар успешно создан
      </Alert>
    </Snackbar>
  );
}
