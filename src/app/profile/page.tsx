'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image'; // ✅ This is the one you want!


type User = {
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER';
  image?: string; // optional profile image
};


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/profile/me')
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);



  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch("/api/profile/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  
    const result = await res.json();
  
    if (!res.ok) {
      alert(result.error || "Something went wrong");
    } else {
      alert(result.message);
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleAvatarUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit triggered");

    if (!avatar) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    const res = await fetch("/api/profile/upload-avatar", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("Upload result:", result);

    if (!res.ok) {
      alert(result.error || "Upload failed");
    } else {
      alert("Profile picture updated!");
      setUser((prev) => prev ? { ...prev, image: result.image } : null);
      setAvatar(null);
    }
  };

  if (!user) {
    return <p className="p-4">Loading profile...</p>;
  }

  return (
    <div className="p-8 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">👤 Profile</h1>

      {user.image && (
        <Image
          src={user.image}
          alt="Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border"
        />
        )}

      <div className="text-sm space-y-1">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

              <form onSubmit={handlePasswordChange} className="space-y-2">
          <h2 className="text-lg font-semibold">🔒 Change Password</h2>

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Update Password
          </button>
        </form>


        <form onSubmit={handleAvatarUpload} className="space-y-2">
        <h2 className="text-lg font-semibold">🖼️ Update Profile Picture</h2>

        {user.image && (
        <Image
          src={user.image}
          alt="Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border"
        />
      )}


        <div>
          <label
            htmlFor="avatar-upload"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white-800 px-4 py-2 rounded cursor-pointer transition-colors duration-150"
          >
            Select File
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              console.log("Selected file:", file);
              setAvatar(file || null);
            }}
            className="hidden"
          />
          {avatar && (
            <p className="text-sm text-gray-600 mt-1">Selected: {avatar.name}</p>
          )}
        </div>


        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          Upload
        </button>
      </form>

    </div>
  );
}
