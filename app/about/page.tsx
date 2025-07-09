'use client'
import { useState, useEffect } from "react";


type User = {
    _id: string;
    name: string;
    email: string;
};

const About = () => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch('api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(data.users);
            return data.users;
        }
        fetchUsers()
    },[])



    return (
        <section className="max-w-7xl mx-auto px-4 py-16 ">
            <div className="flex flex-col items-center space-y-8">
                <div>
                    <div className="mr-20">
                        {users && users.map((user) => {
                            return (
                                <div key={user._id} className="bg-gray-900/30 border border-gray-700/30 rounded-2xl p-6 mb-4">
                                    <h3 className="text-white text-lg font-semibold mb-2">{user.name}</h3>
                                    <p className="text-gray-200">Email: {user.email}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About