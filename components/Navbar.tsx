import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    Portfolio
                </Link>
                <div className="hidden md:flex space-x-8">
                    <Link href="#about" className="text-gray-300 hover:text-white transition">About</Link>
                    <Link href="#skills" className="text-gray-300 hover:text-white transition">Skills</Link>
                    <Link href="#projects" className="text-gray-300 hover:text-white transition">Projects</Link>
                    <Link href="#contact" className="text-gray-300 hover:text-white transition">Contact</Link>
                    <Link href="/admin" className="text-blue-400 hover:text-blue-300 transition">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
