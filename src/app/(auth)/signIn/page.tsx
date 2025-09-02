"use client"

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';


export default function page() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    setIsSubmitting(false);
    console.log(response)

    if (response?.error) {
      toast.error(response.error)
      form.setError("root", {
        type: "server",
        message: response.error
      })
      return
    }

    if (response?.url) {
      router.replace("/dashboard")
    }
    
    toast.success("Sign in successful")

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-background">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-card shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">
            Sign in to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email/Username"
                      {...field}
                    />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />  Please wait...
                  </>
                ) : ("Signin")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Become a member?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
