import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Home, ShoppingCart, Bell } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ProfileButton from "./ProfileButton";

export default function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
            <Link href="/" className="flex items-center gap-2">
                <Image 
                src="/logo.png" 
                alt="TrendLama" 
                width={36} 
                height={36} 
                className="w-6 md:w-9 md:h-9"
                />
                <p className="text-xl hidden md:block font-medium tracking-wider">TRENDLAMA.COM</p>
            </Link>
            <div className="flex items-center gap-2">
                <SearchBar />
                <Link href="/">
                    <Home className="size-4 text-gray-500" />
                </Link>
                <Bell className="size-4 text-gray-500" />
                <Link href="/cart">
                    <ShoppingCart className="size-4 text-gray-500" />
                </Link>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <ProfileButton />
                </SignedIn>
            </div>
        </nav>
    )
}