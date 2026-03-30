import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import crossIcon from '../../../assets/cross.svg';
import searchIcon from '../../../assets/search.svg';

interface IProductsSearchHeaderProps {
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
}

export function ProductsSearchHeader({
  searchDraft,
  onSearchDraftChange,
  onSearchSubmit,
  onClearSearch,
}: IProductsSearchHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: 'var(--color-white)',
        borderRadius: '10px',
        px: { xs: '16px', md: '30px' },
        minHeight: '105px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: '16px', md: '10px' },
        boxSizing: 'border-box',
        boxShadow: 'var(--shadow-products-search)',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'var(--font-cairo)',
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: '45px',
          color: 'var(--products-title-primary)',
          flexShrink: 0,
        }}
      >
        Товары
      </Typography>

      <Box
        component="form"
        onSubmit={onSearchSubmit}
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          maxWidth: { md: '1023px' },
          width: '100%',
          mx: 'auto',
        }}
      >
        <TextField
          fullWidth
          placeholder="Найти"
          value={searchDraft}
          onChange={(e) => onSearchDraftChange(e.target.value)}
          sx={{
            maxWidth: '1023px',
            '& .MuiOutlinedInput-root': {
              height: 48,
              borderRadius: '8px',
              bgcolor: 'var(--products-search-bg)',
              pl: '20px',
              pr: '20px',
              py: '12px',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              lineHeight: '24px',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
            '& .MuiInputBase-input': {
              py: 0,
              '&::placeholder': {
                color: 'var(--products-search-placeholder)',
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="img" src={searchIcon} alt="" />
              </InputAdornment>
            ),
            endAdornment:
              searchDraft.trim().length > 0 ? (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="Очистить поиск"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={onClearSearch}
                    sx={{ p: '4px', color: 'var(--products-search-placeholder)' }}
                  >
                    <Box component="img" sx={{ width: 16, height: 16 }} src={crossIcon} alt="" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
          }}
        />
      </Box>
    </Box>
  );
}
