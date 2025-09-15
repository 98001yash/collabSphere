import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getUserProfile } from "../api"; // import API function

const ProfilePage = () => {
  const { token } = useContext(AuthContext); // make sure your AuthContext provides token
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(token);
        setProfile(res); // backend returns UserResponseDto
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    alert("Profile saved (integration pending)"); 
    // Later: call backend API to update bio, avatar, etc.
  };

  if (loading) return <p className="text-center py-10">Loading profile...</p>;
  if (!profile) return <p className="text-center py-10">No profile found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
              />
            ) : (
              <div className="bg-white text-blue-600 font-bold text-4xl rounded-full w-24 h-24 flex items-center justify-center shadow-lg border-4 border-white">
                {profile.name?.charAt(0)}
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition"
            >
              📷
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Name & Email */}
          <div>
            <h1 className="text-4xl font-bold">{profile.name}</h1>
            <p className="opacity-90">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Edit Profile ✏️
          </h2>

          <label className="block mb-2 font-semibold">Name</label>
          <input
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <label className="block mb-2 font-semibold">Email</label>
          <input
            name="email"
            value={profile.email || ""}
            className="w-full p-3 border rounded-lg mb-4 bg-gray-100 cursor-not-allowed"
            disabled
          />

          <label className="block mb-2 font-semibold">Bio</label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            rows={4}
          />

          <label className="block mb-2 font-semibold">Location</label>
          <input
            name="location"
            value={profile.location || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
