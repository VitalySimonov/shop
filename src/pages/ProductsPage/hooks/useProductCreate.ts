import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createProduct,
  getProductCategories,
  type IProductCategoryOption,
} from '../../../implementation/products/productsApi';
import { z } from 'zod';

const createProductFormSchema = z.object({
  title: z.string().min(1, 'Введите название'),
  article: z.string().min(1, 'Введите артикул'),
  category: z.string().min(1, 'Выберите вендора'),
  price: z
    .string()
    .min(1, 'Введите цену')
    .refine((s) => !Number.isNaN(Number(s)), 'Укажите корректную цену')
    .refine((s) => Number(s) >= 0, 'Цена не может быть отрицательной'),
});

export type ICreateProductFormValues = z.infer<typeof createProductFormSchema>;

type IUpdateParams = (patch: Record<string, string | number | undefined | null>) => void;

export function useProductCreate(updateParams: IUpdateParams) {
  const [createOpen, setCreateOpen] = useState(false);
  const [createCategories, setCreateCategories] = useState<IProductCategoryOption[]>([]);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccessOpen, setCreateSuccessOpen] = useState(false);

  const {
    register,
    handleSubmit: handleCreateSubmit,
    control,
    reset: resetCreateForm,
    formState: { errors: createFormErrors },
  } = useForm<ICreateProductFormValues>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      title: '',
      article: '',
      category: '',
      price: '',
    },
  });

  useEffect(() => {
    if (!createOpen) {
      return;
    }
    let cancelled = false;
    getProductCategories()
      .then((data) => {
        if (!cancelled) {
          setCreateCategories([...data].sort((a, b) => a.name.localeCompare(b.name, 'ru')));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCreateCategories([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [createOpen]);

  const openCreateDialog = useCallback(() => {
    setCreateError(null);
    resetCreateForm({
      title: '',
      article: '',
      category: '',
      price: '',
    });
    setCreateOpen(true);
  }, [resetCreateForm]);

  const submitCreateProduct = async (values: ICreateProductFormValues) => {
    setCreateError(null);
    setCreateSubmitting(true);
    try {
      await createProduct({
        title: values.title.trim(),
        category: values.category,
        price: Number(values.price),
        stock: 0,
        sku: values.article.trim(),
      });
      setCreateOpen(false);
      resetCreateForm({
        title: '',
        article: '',
        category: '',
        price: '',
      });
      setCreateSuccessOpen(true);
      updateParams({ page: 1 });
    } catch {
      setCreateError('Не удалось создать товар');
    } finally {
      setCreateSubmitting(false);
    }
  };

  return {
    createOpen,
    setCreateOpen,
    createCategories,
    createSubmitting,
    createError,
    createSuccessOpen,
    setCreateSuccessOpen,
    register,
    control,
    createFormErrors,
    openCreateDialog,
    submitCreateProduct,
    handleCreateSubmit,
  };
}
