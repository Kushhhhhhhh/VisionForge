"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

const Header = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status])

  return (
    <div className="bg-background/50 sticky top-0 backdrop-blur border-b z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/">
          <h2 className="font-bold text-2xl">VisionForge</h2>
        </Link>
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : !session ? (
          <div className="flex items-center">
            <Button onClick={() => signIn("google")}>Login</Button>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Button onClick={() => signOut()} variant="destructive">
              Logout
            </Button>
            <Link href="/profile">
              <Avatar>
                <AvatarImage 
                src={session.user?.image || ""} 
                className="w-10 h-10 rounded-full" 
                alt={session.user?.name?.charAt(0).toUpperCase() || undefined}
                />
                <AvatarFallback>{session.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header