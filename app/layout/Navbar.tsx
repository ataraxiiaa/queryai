import Link from "next/link";


const Navbar = () => {
    return (
        <nav className="bg-[#01030F] border-b border-gray-800">
            <div className="flex max-w-7xl mx-auto items-center justify-center p-4">
                <Link href='/' className="text-white text-lg font-bold">QAI</Link>
                <div className="container mx-auto flex items-center justify-center">
                    <div className="space-x-8 rounded-full border border-gray-800 mt-2 px-10 py-3">
                        <Link href="/" className="text-gray-300  hover:text-[#9D9D9D]">Home</Link>
                        <Link href="/about" className="text-white font-semibold hover:text-[#9D9D9D]">About</Link>
                        <Link href="/add" className="text-gray-300 hover:text-[#9D9D9D]">Add</Link>
                    </div>
                </div>
                <Link href='/' className="rounded-full border border-gray-800 text-white t-2 px-10 py-3 hover:text-[#9D9D9D]">Login</Link>
            </div>
        </nav>
    );
}

export default Navbar;