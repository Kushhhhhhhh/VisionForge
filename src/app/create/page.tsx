"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
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
import { useTheme } from "next-themes";
import ShimmerButton from "@/components/ui/shimmer-button";

const Particles = dynamic(() => import("@/components/ui/particles"), { ssr: false });

const formSchema = z.object({
    prompt: z.string().min(7, {
        message: "Prompt must be at least 7 characters.",
    }),
});

const imageEffectsInitialState = {
    isBlurred: false,
    isBlackAndWhite: false,
    isBrightened: false,
    isDarkened: false,
    isWet: false,
    isSepia: false,
    isInverted: false,
};

export default function Create() {
    
    const [outputImage, setOutputImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageEffects, setImageEffects] = useState(imageEffectsInitialState);
    const { theme } = useTheme();
    const [color, setColor] = useState("#ffffff");

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.url) {
                    setOutputImage(data.url);
                } else {
                    throw new Error("Invalid response from server");
                }
            } else {
                throw new Error("Error fetching image");
            }
        } catch (error) {
            console.error("Error generating image:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const handleDownload = useCallback(() => {
        if (outputImage) window.open(outputImage, '_blank');
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
        return Object.entries(imageEffects).reduce((className, [effect, isActive]) => {
            if (isActive) {
                switch (effect) {
                    case 'isBlurred':
                        return `${className} blur-sm`;
                    case 'isBlackAndWhite':
                        return `${className} grayscale`;
                    case 'isBrightened':
                        return `${className} brightness-125`;
                    case 'isDarkened':
                        return `${className} brightness-75`;
                    case 'isWet':
                        return `${className} contrast-125 saturate-150`;
                    case 'isSepia':
                        return `${className} sepia`;
                    case 'isInverted':
                        return `${className} invert`;
                    default:
                        return className;
                }
            }
            return className;
        }, 'rounded-xl absolute top-0 left-0 transition-all duration-300');
    }, [imageEffects]);

    useEffect(() => {
        setColor(theme === "dark" ? "#ffffff" : "#000000");
    }, [theme]);

    return (
        <div className="w-full h-full p-3 flex flex-col items-center justify-start pt-[72px] overflow-auto relative">
            <Particles
                className="absolute inset-0"
                quantity={100}
                ease={20}
                color={color}
                refresh
            />
            <div className="w-full p-3 relative z-10">
                <h1 className="text-center font-bold text-white text-3xl sm:text-4xl md:text-5xl">
                    Create
                </h1>
                <p className="text-white/60 text-center text-sm sm:text-base">
                    Generate stunning visuals with AI-powered image creation
                </p>
            </div>
            <div className="flex flex-col md:flex-row w-full h-full gap-3 mt-4 relative z-10">
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
                            <Button className="shadow-2xl" type="submit" disabled={loading}>
                                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight lg:text-lg sm:w-auto">
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Generate"
                                    )}
                                </span>
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
                                    <ShimmerButton
                                        key={effect}
                                        onClick={() => toggleEffect(effect as keyof typeof imageEffects)}
                                        className={`px-3 py-1 text-sm ${isActive ? 'bg-blue-500' : ''}`}
                                    >
                                        <span className="text-white">
                                            {effect.replace('is', '')}
                                        </span>
                                    </ShimmerButton>
                                ))}
                                <ShimmerButton
                                    onClick={handleDownload}
                                    className="px-3 py-1 text-sm"
                                >
                                    <span className="text-white flex items-center">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </span>
                                </ShimmerButton>
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