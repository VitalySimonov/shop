import { Box } from '@mui/material';
import { ProductsCreateProductForm } from './components/ProductsCreateProductForm';
import { ProductsDataGridSection } from './components/ProductsDataGridSection';
import { ProductsFiltersDialog } from './components/ProductsFiltersDialog';
import { ProductsSearchHeader } from './components/ProductsSearchHeader';
import { ProductsToolbar } from './components/ProductsToolbar';
import { useProductsPage } from './hooks';

export function ProductsPage() {
  const p = useProductsPage();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: 'min(1920px, 100%)',
        minWidth: 0,
        bgcolor: 'var(--color-bg-app)',
        boxSizing: 'border-box',
        px: { xs: '16px', md: '30px' },
        pt: '20px',
        pb: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '30px',
        mx: 'auto',
      }}
    >
      <ProductsSearchHeader
        searchDraft={p.searchDraft}
        onSearchDraftChange={p.setSearchDraft}
        onSearchSubmit={p.handleSearchSubmit}
        onClearSearch={() => {
          p.setSearchDraft('');
          p.updateParams({ search: null, page: 1 });
        }}
      />

      <Box
        sx={{
          bgcolor: 'var(--color-white)',
          borderRadius: '12px',
          overflowY: 'visible',
          overflowX: 'visible',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          flex: 1,
          p: { xs: '16px', md: '30px' },
          boxShadow: 'var(--shadow-products-main)',
          minWidth: 0,
          maxWidth: '100%',
        }}
      >
        <ProductsToolbar
          onRefresh={p.handleRefresh}
          onOpenFilters={p.openFiltersDialog}
          onClearFiltersAndSort={p.clearFiltersAndSort}
          hasFiltersOrSort={p.hasFiltersOrSort}
          onOpenCreate={p.openCreateDialog}
        />

        <ProductsDataGridSection
          error={p.error}
          loading={p.loading}
          rows={p.rows}
          onOpenCreate={p.openCreateDialog}
          rowCount={p.rowCount}
          paginationModel={p.paginationModel}
          sortModel={p.sortModel}
          rowSelectionModel={p.rowSelectionModel}
          onRowSelectionModelChange={p.setRowSelectionModel}
          getRowClassName={(params) =>
            p.rowSelectionModel.type === 'include' && p.rowSelectionModel.ids.has(params.id)
              ? 'products-row--selected'
              : ''
          }
          onSortModelChange={(model) => {
            const first = model[0];
            if (!first?.field) {
              p.updateParams({ sortBy: null, order: null, page: 1 });
              return;
            }
            p.updateParams({
              sortBy: first.field,
              order: first.sort ?? 'asc',
              page: 1,
            });
          }}
          onPaginationModelChange={(model) => {
            p.updateParams({
              page: model.page + 1,
            });
          }}
          from={p.from}
          to={p.to}
          page={p.page}
          totalPages={p.totalPages}
          pageNumbers={p.pageNumbers}
          onPageChange={(pageNum) => p.updateParams({ page: pageNum })}
        />
      </Box>

      <ProductsFiltersDialog
        open={p.filterOpen}
        onClose={() => {
          p.setFilterApplyError(null);
          p.setFilterOpen(false);
        }}
        filterApplyError={p.filterApplyError}
        draftFilterTitle={p.draftFilterTitle}
        onDraftFilterTitleChange={p.setDraftFilterTitle}
        draftFilterArticle={p.draftFilterArticle}
        onDraftFilterArticleChange={p.setDraftFilterArticle}
        categories={p.categories}
        categoriesLoading={p.categoriesLoading}
        draftVendors={p.draftVendors}
        onDraftVendorsChange={p.setDraftVendors}
        draftPriceMin={p.draftPriceMin}
        onDraftPriceMinChange={p.setDraftPriceMin}
        draftPriceMax={p.draftPriceMax}
        onDraftPriceMaxChange={p.setDraftPriceMax}
        draftRatingMin={p.draftRatingMin}
        onDraftRatingMinChange={p.setDraftRatingMin}
        draftRatingMax={p.draftRatingMax}
        onDraftRatingMaxChange={p.setDraftRatingMax}
        onApply={p.applyFiltersFromDraft}
      />

      <ProductsCreateProductForm
        open={p.createOpen}
        onClose={() => p.setCreateOpen(false)}
        createSubmitting={p.createSubmitting}
        createError={p.createError}
        createCategories={p.createCategories}
        register={p.register}
        control={p.control}
        errors={p.createFormErrors}
        onFormSubmit={p.handleCreateSubmit(p.submitCreateProduct)}
        successSnackbarOpen={p.createSuccessOpen}
        onSuccessSnackbarClose={() => p.setCreateSuccessOpen(false)}
      />
    </Box>
  );
}
