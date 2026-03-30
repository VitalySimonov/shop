import { useMemo } from 'react';
import { Alert, Box, Button, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowClassNameParams,
  type GridRowSelectionModel,
  type GridSortModel,
} from '@mui/x-data-grid';
import type { IProduct } from '../../../types/Product';
import { articleFromId, ratingFromId } from '../../../implementation/products/productFilters';
import plusIcon from '../../../assets/plus.svg';
import threeDotsIcon from '../../../assets/three-dots.svg';
import type { SxProps, Theme } from '@mui/material/styles';
import { formatPriceRub, splitPriceFormatted } from '../../../utilits/productsPageUtils';

const gridSx: SxProps<Theme> = {
  flex: 1,
  border: 'none',
  borderRadius: 0,
  fontFamily: 'var(--font-inter)',
  '--DataGrid-rowBorderColor': 'var(--products-divider)',
  '& .MuiDataGrid-main': {
    borderTop: '1px solid var(--products-divider)',
  },
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: 'none',
    backgroundColor: 'var(--color-white)',
  },
  '& .MuiDataGrid-columnHeader': {
    px: '18px',
    py: 0,
  },
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus-visible':
    {
      outline: 'none',
    },
  '& .MuiDataGrid-columnHeaderCheckbox': {
    px: '0',
    boxSizing: 'border-box',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontFamily: 'var(--font-cairo)',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '30px',
    color: 'var(--color-gray-400)',
  },
  '& .MuiDataGrid-row': {
    minHeight: '71px !important',
    maxHeight: '71px !important',
  },
  '& .MuiDataGrid-cell': {
    minHeight: '71px !important',
    maxHeight: '71px !important',
    alignItems: 'center',
    display: 'inline-flex',
    borderBottom: '1px solid var(--products-divider)',
    fontSize: '16px',
  },
  '& .MuiDataGrid-cell:not(.MuiDataGrid-cellCheckbox)': {
    px: '18px',
  },
  '& .MuiDataGrid-cellCheckbox': {
    px: '0',
    boxSizing: 'border-box',
  },
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-filler': {
    borderTop: 'none',
    '& > div': {
      borderTop: 'none !important',
    },
  },
  '& .MuiCheckbox-root': {
    color: 'var(--color-gray-400)',
    '&.Mui-checked': {
      color: 'var(--products-pagination-bar)',
    },
  },
  '& .MuiDataGrid-row.products-row--selected': {
    boxShadow: 'inset 3px 0 0 var(--products-pagination-bar)',
  },
};

function createProductColumns(): GridColDef<IProduct>[] {
  return [
    {
      field: 'title',
      headerName: 'Наименование',
      flex: 1,
      minWidth: 278,
      width: 278,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing="18px"
          sx={{ width: '100%', minWidth: 0 }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              bgcolor: 'var(--products-thumb-placeholder)',
              border: '1px solid var(--products-border-soft)',
            }}
          >
            {params.row.thumbnail ? (
              <Box
                component="img"
                src={params.row.thumbnail}
                alt=""
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : null}
          </Box>
          <Stack spacing={0} sx={{ minWidth: 0, alignItems: 'start' }}>
            <Typography
              sx={{
                maxWidth: 210,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-cairo)',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '30px',
                color: 'var(--products-cell-secondary)',
              }}
            >
              {params.row.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-cairo)',
                fontSize: '14px',
                lineHeight: '26px',
                color: 'var(--color-gray-400)',
              }}
            >
              {params.row.category}
            </Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'category',
      headerName: 'Вендор',
      flex: 1,
      minWidth: 125,
      width: 125,
      sortable: true,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_, row) => row.category,
      renderCell: (params) => (
        <Typography
          sx={{
            width: '100%',
            textAlign: 'center',
            fontFamily: 'var(--font-open-sans)',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '22px',
            color: 'var(--color-black)',
          }}
        >
          {params.value as string}
        </Typography>
      ),
    },
    {
      field: 'article',
      headerName: 'Артикул',
      flex: 1,
      minWidth: 160,
      width: 160,
      sortable: true,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_, row) => articleFromId(row.id),
      renderCell: (params) => (
        <Typography
          sx={{
            width: '100%',
            textAlign: 'center',
            fontFamily: 'var(--font-open-sans)',
            fontSize: '16px',
            lineHeight: '22px',
            color: 'var(--color-black)',
          }}
        >
          {params.value as string}
        </Typography>
      ),
    },
    {
      field: 'rating',
      headerName: 'Оценка',
      flex: 1,
      minWidth: 125,
      width: 125,
      sortable: true,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (_, row) => ratingFromId(row.id),
      renderCell: (params) => {
        const r = params.value as number;
        const low = r < 3.5;
        return (
          <Typography
            component="div"
            sx={{
              width: '100%',
              textAlign: 'center',
              fontFamily: 'var(--font-open-sans)',
              fontSize: '16px',
              lineHeight: '22px',
              color: 'var(--color-black)',
            }}
          >
            <Box component="span" sx={{ color: low ? 'var(--color-red)' : 'var(--color-black)' }}>
              {r.toFixed(1)}
            </Box>
            <Box component="span" sx={{ color: 'var(--color-black)' }}>
              /5
            </Box>
          </Typography>
        );
      },
    },
    {
      field: 'price',
      headerName: 'Цена, ₽',
      flex: 1,
      minWidth: 160,
      width: 160,
      type: 'number',
      sortable: true,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const full = formatPriceRub(Number(params.row.price ?? 0));
        const { integerPart, fractionPart } = splitPriceFormatted(full);
        return (
          <Typography
            component="div"
            sx={{
              width: '100%',
              textAlign: 'center',
              fontFamily: 'var(--font-roboto-mono)',
              fontSize: '16px',
              lineHeight: '20px',
              color: 'var(--color-black)',
            }}
          >
            <Box component="span" sx={{ color: 'var(--products-cell-secondary)' }}>
              {integerPart}
            </Box>
            {fractionPart ? (
              <Box component="span" sx={{ color: 'var(--products-search-placeholder)' }}>
                {fractionPart}
              </Box>
            ) : null}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      minWidth: 120,
      width: 133,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: () => (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ gap: '32px' }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{
              width: 52,
              height: 27,
              borderRadius: '23px',
              bgcolor: 'var(--color-blue-900)',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'var(--color-blue-900)',
              },
            }}
          >
            <Box
              component="img"
              src={plusIcon}
              alt=""
              sx={{ width: '24px', height: '24px', objectFit: 'cover', display: 'block' }}
            />
          </IconButton>

          <IconButton aria-label="Действия" onClick={(e) => e.stopPropagation()} sx={{ p: 0 }}>
            <Box
              component="img"
              src={threeDotsIcon}
              alt=""
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </IconButton>
        </Stack>
      ),
    },
  ];
}

interface IProductsDataGridSectionProps {
  error: string | null;
  loading: boolean;
  rows: IProduct[];
  onOpenCreate: () => void;
  rowCount: number;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  rowSelectionModel: GridRowSelectionModel;
  onRowSelectionModelChange: (model: GridRowSelectionModel) => void;
  getRowClassName: (params: GridRowClassNameParams) => string;
  onSortModelChange: (model: GridSortModel) => void;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  from: number;
  to: number;
  page: number;
  totalPages: number;
  pageNumbers: number[];
  onPageChange: (page: number) => void;
}

export function ProductsDataGridSection({
  error,
  loading,
  rows,
  rowCount,
  paginationModel,
  sortModel,
  rowSelectionModel,
  onRowSelectionModelChange,
  getRowClassName,
  onSortModelChange,
  onPaginationModelChange,
  from,
  to,
  page,
  totalPages,
  pageNumbers,
  onPageChange,
}: IProductsDataGridSectionProps) {
  const columns = useMemo(() => createProductColumns(), []);

  return (
    <>
      {error && (
        <Box sx={{ pb: 0 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'visible',
          height: 'auto',
          maxHeight: 'none',
          minHeight: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {loading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              zIndex: 3,
              height: 3,
              borderRadius: 0,
              bgcolor: 'var(--overlay-blue-900-12)',
            }}
          />
        )}
        <DataGrid
          autoHeight
          sx={gridSx}
          rowHeight={71}
          columnHeaderHeight={73}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={onRowSelectionModelChange}
          getRowClassName={getRowClassName}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          disableColumnMenu
          hideFooter
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          py: '11px',
          px: { xs: '16px', md: '30px' },
          minHeight: '52px',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          component="div"
          sx={{
            fontFamily: 'var(--font-roboto)',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '21px',
            color: 'var(--products-pagination-muted)',
          }}
        >
          Показано{' '}
          <Box component="span" sx={{ color: 'var(--products-heading)' }}>
            {from}-{to}
          </Box>{' '}
          из{' '}
          <Box component="span" sx={{ color: 'var(--products-heading)' }}>
            {rowCount}
          </Box>
        </Typography>
        <Stack direction="row" alignItems="center" spacing="16px">
          <IconButton
            aria-label="Предыдущая страница"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            sx={{ p: 0, color: 'var(--color-gray-400)' }}
          >
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Stack direction="row" spacing="8px" alignItems="center">
            {pageNumbers.map((num) => {
              const active = num === page;
              return (
                <Button
                  key={num}
                  onClick={() => onPageChange(num)}
                  sx={{
                    minWidth: 30,
                    width: 30,
                    height: 30,
                    p: 0,
                    borderRadius: '4px',
                    fontFamily: 'var(--font-cairo)',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '26px',
                    ...(active
                      ? {
                          bgcolor: 'var(--color-blue-500)',
                          color: 'var(--color-white)',
                          boxShadow: 'var(--shadow-products-dialog)',
                          border: 'none',
                          '&:hover': { bgcolor: 'var(--color-blue-500-hover)' },
                        }
                      : {
                          bgcolor: 'var(--color-white)',
                          color: 'var(--color-gray-400)',
                          border: '1px solid var(--products-border-soft)',
                          filter: 'drop-shadow(var(--shadow-products-dialog))',
                          '&:hover': { bgcolor: 'var(--products-surface-hover)' },
                        }),
                  }}
                >
                  {num}
                </Button>
              );
            })}
          </Stack>
          <IconButton
            aria-label="Следующая страница"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            sx={{ p: 0, color: 'var(--color-gray-400)' }}
          >
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>
    </>
  );
}
