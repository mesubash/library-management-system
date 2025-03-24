import React from "react";

const Profile = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                        value="John Doe"
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                        Email:
                    </label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        value="johndoe@example.com"
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium mb-1">
                        Role:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value="Librarian"
                        readOnly
                    />
                </div>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;