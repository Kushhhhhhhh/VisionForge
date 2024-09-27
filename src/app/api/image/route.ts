import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { toast } from "@/hooks/use-toast";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        toast({
            title: "Error",
            description: "Please Login",
            variant: "destructive",
        });
        return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 });
    }

    const { prompt } = await request.json();

    const user = await prisma.user.findUnique({
        where: { id: session.user?.id },
    });

    if (!user) {
        toast({
            title: "Error",
            description: "Please Login",
            variant: "destructive",
        });
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const randomSeed = Math.floor(Math.random() * 10000000) + 1;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&seed=${randomSeed}&width=512&height=512&nologo=true&enhance=true`;

    await fetch(imageUrl);

    await prisma.post.create({
        data: {
            url: imageUrl,
            prompt,
            seed: randomSeed,
            userId: user.id
        },
    });

    return NextResponse.json({ url: imageUrl });
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        toast({
            title: "Error",
            description: "Please Login",
            variant: "destructive",
        });
        return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user?.id },
    });

    if (!user) {
        toast({
            title: "Error",
            description: "Please Login",
            variant: "destructive",
        });
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await prisma.post.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return NextResponse.json(posts);
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        toast({
            title: "Error",
            description: "Please Login",
            variant: "destructive",
        });
        return NextResponse.json({ error: "You are Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    await prisma.post.delete({
        where: {
            id: id,
        },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
}