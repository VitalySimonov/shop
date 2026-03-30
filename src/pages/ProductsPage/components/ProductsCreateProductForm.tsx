import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { IProductCategoryOption } from '../../../implementation/products/productsApi';
import type { ICreateProductFormValues } from '../hooks/useProductCreate';
import { ProductCreateSuccessSnackbar } from './ProductCreateSuccessSnackbar';

interface IProductsCreateProductFormProps {
  open: boolean;
  onClose: () => void;
  createSubmitting: boolean;
  createError: string | null;
  createCategories: IProductCategoryOption[];
  register: UseFormRegister<ICreateProductFormValues>;
  control: Control<ICreateProductFormValues>;
  errors: FieldErrors<ICreateProductFormValues>;
  onFormSubmit: React.FormEventHandler<HTMLFormElement>;
  successSnackbarOpen: boolean;
  onSuccessSnackbarClose: () => void;
}

export function ProductsCreateProductForm({
  open,
  onClose,
  createSubmitting,
  createError,
  createCategories,
  register,
  control,
  errors,
  onFormSubmit,
  successSnackbarOpen,
  onSuccessSnackbarClose,
}: IProductsCreateProductFormProps) {
  return (
    <>
      <Dialog open={open} onClose={() => !createSubmitting && onClose()} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: 'var(--font-cairo)', fontWeight: 700 }}>
          Новый товар
        </DialogTitle>
        <Box
          component="form"
          onSubmit={onFormSubmit}
          sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}
        >
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {createError && <Alert severity="error">{createError}</Alert>}
            <TextField
              label="Название"
              fullWidth
              autoFocus
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register('title')}
            />
            <TextField
              label="Артикул"
              fullWidth
              placeholder="Например SKU-001"
              error={Boolean(errors.article)}
              helperText={errors.article?.message}
              {...register('article')}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.category)}>
                  <InputLabel id="create-product-vendor-label">Вендор</InputLabel>
                  <Select
                    labelId="create-product-vendor-label"
                    id="create-product-vendor"
                    label="Вендор"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    input={<OutlinedInput label="Вендор" />}
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 280 } },
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      transformOrigin: { vertical: 'top', horizontal: 'left' },
                    }}
                  >
                    <MenuItem value="">
                      <Box component="span" sx={{ color: 'var(--products-search-placeholder)' }}>
                        Выберите вендора
                      </Box>
                    </MenuItem>
                    {createCategories.map((c) => (
                      <MenuItem key={c.category} value={c.category}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category ? (
                    <FormHelperText>{errors.category.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <TextField
              label="Цена"
              type="number"
              fullWidth
              inputProps={{ step: 'any', min: 0 }}
              error={Boolean(errors.price)}
              helperText={errors.price?.message}
              {...register('price')}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              type="button"
              onClick={() => !createSubmitting && onClose()}
              disabled={createSubmitting}
              sx={{ textTransform: 'none' }}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createSubmitting}
              sx={{ textTransform: 'none' }}
            >
              {createSubmitting ? 'Создание…' : 'Создать'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <ProductCreateSuccessSnackbar open={successSnackbarOpen} onClose={onSuccessSnackbarClose} />
    </>
  );
}
