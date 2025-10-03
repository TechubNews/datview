'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 使用 Zod 定义表单的校验 schema
const formSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z.string().min(1, { message: '密码不能为空' }),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { setAccessToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 表单提交处理函数
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    try {
      const response = await api.post('/auth/login', values);
      const { access_token } = response.data;
      
      setAccessToken(access_token);
      
      // 登录成功后，可以请求用户信息
      // const userResponse = await api.get('/auth/profile');
      // setUser(userResponse.data);

      // 跳转到受保护的仪表盘页面
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请检查您的凭证');
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">登录 DAT View</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? '登录中...' : '登录'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
