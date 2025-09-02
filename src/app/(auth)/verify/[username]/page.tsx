"use client"

import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"

export default function VerifyOtp() {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    //Zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params?.username,
                code: data.code
            })

            if (response.data.success) {
                toast.success(response.data.message);
                router.replace(`/signIn`)
            } else {
                console.error("Error in verify code: ", response.data.message)
                form.setError("code", {
                    type: "server",
                    message: response.data.message
                })
            }
        } catch (error) {
            console.error("Error in verify code: ", error)
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message ?? "Error in Verifying code";
            toast.error(errorMessage);
            form.setError("code", {
                type: "server",
                message: errorMessage
            })
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100 dark:bg-background'>
            <div className='w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder='code' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />  Please wait...
                                    </>
                                ) : ("Submit")
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
