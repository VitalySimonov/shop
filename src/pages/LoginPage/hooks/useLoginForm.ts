import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});

export type ILoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const form = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);

  return { form, showPassword, setShowPassword };
}
