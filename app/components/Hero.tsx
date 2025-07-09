import Image from "next/image";


const Hero = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
                <div className="flex flex-col justify-center px-2">
                    <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-4">
                        Revolutionalize Your
                    </h1>
                    <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-4">
                        <span className="bg-gradient-to-r from-[#9D9D9D] to-[#EDEDED] bg-clip-text text-transparent">Workflow </span>
                        with AI
                    </h1>
                    <p className="text-white font-light text-base mb-6 max-w-sm mt-2">
                        Experience cutting-edge solutions designed to elevate productivity and deliver results like never before.
                    </p>
                    <div className="flex">
                        <button className="text-white mt-4 px-6 py-2 bg-black outline-4 outline-gray-800 outline-offset-8 rounded-full hover:text-[#9D9D9D] cursor-pointer">
                            Get Started
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/40 via-gray-200/25 to-transparent rounded-full blur-3xl -z-10"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-130 h-110 bg-gradient-radial from-white/60 via-gray-100/30 to-transparent rounded-full blur-2xl -z-10"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-110 h-100 bg-gradient-radial from-white/80 via-gray-50/20 to-transparent rounded-full blur-xl -z-10"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-75 h-100 bg-white/40 rounded-full blur-lg -z-10"></div>
                    <Image
                        src="/Hero.png"
                        alt="Hero Image"
                        width={568}
                        height={700}
                    />
                </div>
            </div>
        </section>
    );
}

export default Hero;