import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  type SelectChangeEvent,
} from '@mui/material';
import type { IProductCategoryOption } from '../../../implementation/products/productsApi';

interface IProductsFiltersDialogProps {
  open: boolean;
  onClose: () => void;
  filterApplyError: string | null;
  draftFilterTitle: string;
  onDraftFilterTitleChange: (v: string) => void;
  draftFilterArticle: string;
  onDraftFilterArticleChange: (v: string) => void;
  categories: IProductCategoryOption[];
  categoriesLoading: boolean;
  draftVendors: string[];
  onDraftVendorsChange: (v: string[]) => void;
  draftPriceMin: string;
  onDraftPriceMinChange: (v: string) => void;
  draftPriceMax: string;
  onDraftPriceMaxChange: (v: string) => void;
  draftRatingMin: string;
  onDraftRatingMinChange: (v: string) => void;
  draftRatingMax: string;
  onDraftRatingMaxChange: (v: string) => void;
  onApply: () => void;
}

export function ProductsFiltersDialog({
  open,
  onClose,
  filterApplyError,
  draftFilterTitle,
  onDraftFilterTitleChange,
  draftFilterArticle,
  onDraftFilterArticleChange,
  categories,
  categoriesLoading,
  draftVendors,
  onDraftVendorsChange,
  draftPriceMin,
  onDraftPriceMinChange,
  draftPriceMax,
  onDraftPriceMaxChange,
  draftRatingMin,
  onDraftRatingMinChange,
  draftRatingMax,
  onDraftRatingMaxChange,
  onApply,
}: IProductsFiltersDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: 'var(--font-cairo)', fontWeight: 700 }}>Фильтры</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filterApplyError ? <Alert severity="error">{filterApplyError}</Alert> : null}
        <TextField
          label="Наименование содержит"
          value={draftFilterTitle}
          onChange={(e) => onDraftFilterTitleChange(e.target.value)}
          fullWidth
          sx={{ mt: '10px' }}
          placeholder="Текст"
        />
        <TextField
          label="Артикул содержит"
          value={draftFilterArticle}
          onChange={(e) => onDraftFilterArticleChange(e.target.value)}
          fullWidth
          placeholder="Например 00A1"
        />
        <FormControl fullWidth disabled={categoriesLoading}>
          <InputLabel id="products-filter-vendors-label">Вендор</InputLabel>
          <Select<string[]>
            labelId="products-filter-vendors-label"
            id="products-filter-vendors"
            multiple
            value={draftVendors}
            onChange={(e: SelectChangeEvent<string[]>) => {
              const v = e.target.value;
              onDraftVendorsChange(typeof v === 'string' ? v.split(',') : v);
            }}
            input={<OutlinedInput label="Вендор" />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return '';
              }
              return selected
                .map(
                  (category) => categories.find((c) => c.category === category)?.name ?? category,
                )
                .join(', ');
            }}
            MenuProps={{
              PaperProps: { style: { maxHeight: 280 } },
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
              transformOrigin: { vertical: 'top', horizontal: 'left' },
            }}
          >
            {categories.map((c) => (
              <MenuItem key={c.category} value={c.category}>
                <Checkbox
                  checked={draftVendors.includes(c.category)}
                  size="small"
                  sx={{ mr: 0.5 }}
                />
                <ListItemText primary={c.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Цена от"
            type="number"
            value={draftPriceMin}
            onChange={(e) => onDraftPriceMinChange(e.target.value)}
            fullWidth
            inputProps={{ step: 'any', min: 0 }}
          />
          <TextField
            label="Цена до"
            type="number"
            value={draftPriceMax}
            onChange={(e) => onDraftPriceMaxChange(e.target.value)}
            fullWidth
            inputProps={{ step: 'any', min: 0 }}
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            label="Оценка от"
            type="number"
            value={draftRatingMin}
            onChange={(e) => onDraftRatingMinChange(e.target.value)}
            fullWidth
            helperText="от 0 до 5"
            inputProps={{ step: '0.1', min: 0, max: 5 }}
          />
          <TextField
            label="Оценка до"
            type="number"
            value={draftRatingMax}
            onChange={(e) => onDraftRatingMaxChange(e.target.value)}
            fullWidth
            helperText="от 0 до 5"
            inputProps={{ step: '0.1', min: 0, max: 5 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Отмена
        </Button>
        <Button variant="contained" onClick={onApply} sx={{ textTransform: 'none' }}>
          Применить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
