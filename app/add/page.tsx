'use client'

const Add = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formTarget = e.target as typeof e.target & {
            name: { value: string };
            email: { value: string };
            password: { value: string };
            city: { value: string };
        };

        await fetch('api/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formTarget.name.value,
                email: formTarget.email.value,
                password: formTarget.password.value,
                city: formTarget.city.value,
            }),
        });

    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#01030F] to-[#1a1a2e]">
            <form onSubmit={handleSubmit} className="bg-white text-black rounded-xl shadow-lg p-10 w-full max-w-md">
                <h1 className="text-3xl font-extrabold text-center mb-8 text-[#01030F]">Add User</h1>
                <div className="flex flex-col gap-6">
                    <input
                        type="text"
                        placeholder="Enter Name"
                        id="name"
                        name="name"
                        className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01030F] transition"
                    />
                    <input
                        type="text"
                        placeholder="Enter Email"
                        id="email"
                        name="email"
                        className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01030F] transition"
                    />
                    <input
                        type="text"
                        placeholder="Enter City"
                        id="city"
                        name="city"
                        className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01030F] transition"
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        id="password"
                        name="password"
                        className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#01030F] transition"
                    />
                    <button
                        type="submit"
                        className="mt-4 bg-[#01030F] text-white font-semibold py-3 rounded-full hover:bg-[#23234b] transition duration-300"
                    >
                        Add User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Add;