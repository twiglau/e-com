import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="mt-16 flex flex-col items-center md:flex-row md:justify-between md:items-start bg-gray-800 p-8 rounded-lg">
            <div className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-4 md:items-start">
                    <Image 
                    src="/logo.png" 
                    alt="TrendLama" 
                    width={36} 
                    height={36} 
                    className="w-6 md:w-9 md:h-9"
                    />
                    <p className="text-white text-xl hidden md:block font-medium tracking-wider">TRENDLAMA.COM</p>
                </Link>
                <p className="text-sm text-gray-400">© 2026 TrendLama.</p>
                <p className="text-sm text-gray-400">All rights reserved.</p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
                <p>Links</p>
                <Link href="/">Home</Link>
                <Link href="/products">Contact</Link>
                <Link href="/cart">Terms of Service</Link>
                <Link href="/signin">Privacy Policy</Link>
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
                <p>Contact</p>
                <Link href="/">All Products</Link>
                <Link href="/products">New Arrivals</Link>
                <Link href="/cart">Best Sellers</Link>
                <Link href="/signin">Sale</Link>
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
                <p>Contact</p>
                <Link href="/">About</Link>
                <Link href="/">Contact</Link>
                <Link href="/">Blog</Link>
                <Link href="/">FAQ</Link>
            </div>
        </footer>
    )
}