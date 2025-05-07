"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";

const mainNavItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Diets",
    href: "/diets",
  },
  {
    title: "Recommendations",
    href: "/recommendations",
  },
];

const authNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Preferences",
    href: "/preferences",
  },
];

export function Navigation() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="md:flex-1 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold text-xl">Health Lover</span>
          </Link>
        </div>
        
        <div className="hidden md:flex md:items-center md:space-x-8">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
          
          {isAuthenticated && authNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
        
        <div className="flex-1 flex justify-end">
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {session?.user?.image ? (
                        <AvatarImage src={session?.user?.image} alt={session?.user?.name || "User"} />
                      ) : (
                        <AvatarFallback>
                          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Icons.user className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/preferences">
                      <Icons.settings className="mr-2 h-4 w-4" />
                      <span>Preferences</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="cursor-pointer"
                  >
                    <Icons.logout className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
          
          <button
            className="flex items-center ml-4 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <Icons.close className="h-6 w-6" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {showMobileMenu && (
        <div className="flex flex-col space-y-3 p-4 border-t md:hidden">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              onClick={() => setShowMobileMenu(false)}
            >
              {item.title}
            </Link>
          ))}
          
          {isAuthenticated && (
            <>
              <div className="h-px bg-border" />
              {authNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div className="h-px bg-border" />
              <button
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary text-left"
                onClick={() => {
                  setShowMobileMenu(false);
                  signOut({ callbackUrl: '/' });
                }}
              >
                Log out
              </button>
            </>
          )}
          
          {!isAuthenticated && !isLoading && (
            <>
              <div className="h-px bg-border" />
              <Link
                href="/auth/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setShowMobileMenu(false)}
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setShowMobileMenu(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}