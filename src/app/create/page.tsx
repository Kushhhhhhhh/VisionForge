"use client";

import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import Image from "next/image";
import { Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    prompt: z.string().min(7, {
        message: "Prompt must be at least 7 characters.",
    }),
})

export default function Create() {
    const [outputImage, setOutputImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageEffects, setImageEffects] = useState({
        isBlurred: false,
        isBlackAndWhite: false,
        isBrightened: false,
        isDarkened: false,
        isWet: false,
        isSepia: false,
        isInverted: false,
    });

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const response = await fetch("/api/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (response.status === 200) {
                const data = await response.json();
                setOutputImage(data.url);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to generate image. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleDownload = useCallback(() => {
        if (outputImage) {
            window.open(outputImage, '_blank');
        }
    }, [outputImage]);

    const toggleEffect = useCallback((effect: keyof typeof imageEffects) => {
        setImageEffects(prev => ({
            ...prev,
            [effect]: !prev[effect],
            ...(effect === 'isBrightened' && prev.isDarkened ? { isDarkened: false } : {}),
            ...(effect === 'isDarkened' && prev.isBrightened ? { isBrightened: false } : {}),
        }));
    }, []);

    const imageClassName = useMemo(() => {
        const { isBlurred, isBlackAndWhite, isBrightened, isDarkened, isWet, isSepia, isInverted } = imageEffects;
        return `rounded-xl absolute top-0 left-0 
            ${isBlurred ? 'blur-sm' : ''} 
            ${isBlackAndWhite ? 'grayscale' : ''} 
            ${isBrightened ? 'brightness-125' : ''} 
            ${isDarkened ? 'brightness-75' : ''} 
            ${isWet ? 'contrast-125 saturate-150' : ''} 
            ${isSepia ? 'sepia' : ''} 
            ${isInverted ? 'invert' : ''}`;
    }, [imageEffects]);

    return (
        <div className="w-full min-h-dvh p-3 flex flex-col items-center justify-start pt-[72px]">
            <div className="w-full p-3">
                <h1 className="text-center font-bold text-white text-3xl sm:text-4xl md:text-5xl">
                    Create
                </h1>
                <p className="text-white/60 text-center text-sm sm:text-base">
                    Generate stunning visuals with AI-powered image creation
                </p>
            </div>
            <div className="flex flex-col md:flex-row w-full h-full gap-3 mt-4">
                <div className="__form flex-1 md:flex-[2] flex justify-center items-start flex-col">
                    <p className="text-white/80 text-base sm:text-lg md:text-xl font-bold mb-2">
                        Enter your prompt below to generate any image you envision!
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col sm:flex-row gap-2">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:max-w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your prompt here..."
                                                className="w-full transition-all border-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="__output flex-1 bg-white/5 rounded-xl relative min-h-[300px] mt-4 md:mt-0 overflow-hidden">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    ) : outputImage ? (
                        <div className="relative w-full h-full flex flex-col justify-between p-4">
                            <div className="relative w-full h-0 pb-[100%]">
                                <Image
                                    src={outputImage}
                                    alt="Generated Image"
                                    layout="fill"
                                    objectFit="contain"
                                    className={imageClassName}
                                    priority
                                />
                            </div>
                            <div className="mt-4 flex justify-center flex-wrap gap-2">
                                {Object.entries(imageEffects).map(([effect, isActive]) => (
                                    <Button
                                        key={effect}
                                        onClick={() => toggleEffect(effect as keyof typeof imageEffects)}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        {isActive ? effect.replace('is', '') : effect.replace('is', '')}
                                    </Button>
                                ))}
                                <Button
                                    onClick={handleDownload}
                                    variant="secondary"
                                    size="sm"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/50">
                            Your generated image will appear here
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}