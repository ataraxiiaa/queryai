'use client'
import { useState, useEffect } from "react";


type User = {
    user_id: string;
    username: string;
    email: string;
    created_at: string;
};

const About = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
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
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    },[])

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex flex-col items-center space-y-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                    <p className="text-white text-lg">Loading users...</p>
                </div>
            </section>
        );
    }



    return (
        <section className="max-w-7xl mx-auto px-4 py-16 ">
            <div className="flex flex-col items-center space-y-8">
                <div>
                    <div className="mr-20">
                        {users && users.map((user) => {
                            return (
                                <div key={user.user_id} className="bg-gray-900/30 border border-gray-700/30 rounded-2xl p-6 mb-4">
                                    <h3 className="text-white text-lg font-semibold mb-2">Name: {user.username}</h3>
                                    <p className="text-gray-200">Email: {user.email}</p>
                                    <p className="text-gray-200">Created At: {new Date(user.created_at).toLocaleDateString()}</p>

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