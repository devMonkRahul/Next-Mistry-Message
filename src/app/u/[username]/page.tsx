"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod"
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
};

const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function MessagePage() {

    const params = useParams<{ username: string }>();
    const username = params?.username;

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })

    const [isLoading, setIsLoading] = useState(false);
    const [completion, setCompletion] = useState(initialMessageString);
    const [displayedCompletion, setDisplayedCompletion] = useState(initialMessageString);
    const [isStreaming, setIsStreaming] = useState(false);

    // Simulate streaming effect
    useEffect(() => {
        if (completion === displayedCompletion || !isStreaming) return;

        setDisplayedCompletion(""); // Clear current display
        const streamText = () => {
            const targetText = completion;
            let currentIndex = 0;
            
            const interval = setInterval(() => {
                if (currentIndex < targetText.length) {
                    setDisplayedCompletion(targetText.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    setIsStreaming(false);
                }
            }, 40); // Adjust speed (lower = faster)

            return () => clearInterval(interval);
        };

        const cleanup = streamText();
        return cleanup;
    }, [completion]);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>("/api/send-message", {
                username,
                ...data
            })

            toast.success(response.data.message);
            form.reset({ ...form.getValues(), content: "" });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error in sending message");
        } finally {
            setIsLoading(false)
        }
    }

    const messageContent = form.watch("content");

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const fetchSuggestedMessages = async () => {
        try {
            setIsStreaming(true);
            
            const response = await axios.post("/api/suggest-message");
            
            if (response.data.success) {
                setCompletion(response.data.data);
            } else {
                toast.error(response.data.message || "Error in fetching suggested messages");
                setIsStreaming(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error in fetching suggested messages");
            setIsStreaming(false);
        }
    }

    return (
        <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className="my-4 cursor-pointer"
                        disabled={isStreaming}
                    >
                        {isStreaming ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            "Suggest Messages"
                        )}
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {parseStringMessages(displayedCompletion).map((message, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="mb-2 cursor-pointer"
                                onClick={() => handleMessageClick(message)}
                            >
                                {message}
                                {isStreaming && index === parseStringMessages(displayedCompletion).length - 1 && (
                                    <span className="animate-pulse ml-1">|</span>
                                )}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/signup'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    )
}