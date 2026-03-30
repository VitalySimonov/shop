import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import addIcon from '../../../assets/add.svg';
import refreshIcon from '../../../assets/refresh.svg';

interface IProductsToolbarProps {
  onRefresh: () => void;
  onOpenFilters: () => void;
  onClearFiltersAndSort: () => void;
  hasFiltersOrSort: boolean;
  onOpenCreate: () => void;
}

export function ProductsToolbar({
  onRefresh,
  onOpenFilters,
  onClearFiltersAndSort,
  hasFiltersOrSort,
  onOpenCreate,
}: IProductsToolbarProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        minHeight: '42px',
        flexWrap: 'wrap',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'var(--font-cairo)',
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: '25px',
          color: 'var(--products-heading)',
          minWidth: 0,
          flex: 1,
        }}
      >
        Все позиции
      </Typography>

      <Stack direction="row" spacing="8px" alignItems="center" flexWrap="wrap">
        <IconButton
          onClick={onRefresh}
          aria-label="Обновить"
          sx={{
            width: 42,
            height: 42,
            borderRadius: '8px',
            border: '1px solid var(--products-border-soft)',
            bgcolor: 'var(--color-white)',
            color: 'var(--products-toolbar-icon)',
          }}
        >
          <Box component="img" src={refreshIcon} alt="" />
        </IconButton>
        <IconButton
          type="button"
          onClick={onOpenFilters}
          sx={{
            width: 42,
            height: 42,
            borderRadius: '8px',
            border: '1px solid var(--products-border-soft)',
            bgcolor: 'var(--color-white)',
            color: 'var(--products-toolbar-icon)',
          }}
        >
          <FilterListIcon sx={{ fontSize: 20, color: 'var(--products-heading)' }} />
        </IconButton>
        {hasFiltersOrSort ? (
          <Tooltip title="Очистить фильтры и сортировку" enterDelay={300}>
            <IconButton
              type="button"
              onClick={onClearFiltersAndSort}
              aria-label="Очистить фильтры и сортировку"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '8px',
                border: '1px solid var(--products-border-soft)',
                bgcolor: 'var(--color-white)',
                color: 'var(--color-blue-700)',
                '&:hover': {
                  border: '1px solid var(--products-border-soft)',
                  bgcolor: 'var(--products-surface-hover)',
                },
              }}
            >
              <FilterAltOffIcon sx={{ fontSize: 20, color: 'var(--products-heading)' }} />
            </IconButton>
          </Tooltip>
        ) : null}
        <Button
          variant="contained"
          startIcon={
            <Box component="img" sx={{ width: 22, height: 22, mx: '0px' }} src={addIcon} alt="" />
          }
          onClick={onOpenCreate}
          sx={{
            width: '42px',
            minWidth: '147px',
            gap: '15px',
            borderRadius: '8px',
            px: '20px',
            py: '10px',
            fontFamily: 'var(--font-cairo)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '26px',
            textTransform: 'none',
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
            '&:active': { bgcolor: 'var(--color-blue-900)' },
          }}
        >
          Добавить
        </Button>
      </Stack>
    </Stack>
  );
}
