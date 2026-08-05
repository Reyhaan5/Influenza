import { useState } from "react";

export default function ReceiptPrinter() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const searchProfile = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/instagram/${username}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setProfile(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="bg-[#19161f] rounded-3xl shadow-2xl overflow-hidden">

        {/* Top */}
        <div className="p-8">

          <p className="text-sm text-green-400 font-semibold">
            ● LIVE INSTAGRAM ANALYZER
          </p>

          <div className="mt-6 flex gap-3">

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Instagram username"
              className="flex-1 rounded-xl bg-[#25212c] px-5 py-4 text-white outline-none"
            />

            <button
              onClick={searchProfile}
              className="px-7 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              Analyze
            </button>

          </div>

          {loading && (
            <p className="mt-6 text-gray-300">
              Fetching Instagram data...
            </p>
          )}

          {error && (
            <p className="mt-6 text-red-400">
              {error}
            </p>
          )}

        </div>

        {/* Result */}

        {profile && (

          <div className="border-t border-gray-800 p-8 bg-[#121116]">

            <div className="flex gap-6">

              <img
                src={profile.profilePicUrl}
                alt=""
                className="w-28 h-28 rounded-full object-cover"
              />

              <div>

                <h2 className="text-3xl font-bold text-white">
                  {profile.fullName}
                </h2>

                <p className="text-purple-400 text-lg">
                  @{profile.username}
                </p>

                <p className="mt-4 text-gray-300 max-w-2xl">
                  {profile.biography}
                </p>

              </div>

            </div>

            <div className="grid grid-cols-4 gap-6 mt-10">

              <div className="bg-[#1c1924] rounded-xl p-6">

                <p className="text-gray-400">
                  Followers
                </p>

                <h2 className="text-white text-3xl font-bold">
                  {profile.followersCount?.toLocaleString()}
                </h2>

              </div>

              <div className="bg-[#1c1924] rounded-xl p-6">

                <p className="text-gray-400">
                  Following
                </p>

                <h2 className="text-white text-3xl font-bold">
                  {profile.followsCount?.toLocaleString()}
                </h2>

              </div>

              <div className="bg-[#1c1924] rounded-xl p-6">

                <p className="text-gray-400">
                  Posts
                </p>

                <h2 className="text-white text-3xl font-bold">
                  {profile.postsCount}
                </h2>

              </div>

              <div className="bg-[#1c1924] rounded-xl p-6">

                <p className="text-gray-400">
                  Verified
                </p>

                <h2 className="text-white text-3xl font-bold">
                  {profile.verified ? "✅ Yes" : "❌ No"}
                </h2>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">

              <div className="bg-[#1c1924] rounded-xl p-6">

                <p className="text-gray-400">
                  Business Account
                </p>

                <h2 className="text-white text-xl mt-2">
                  {profile.isBusinessAccount ? "Yes" : "No"}
                </h2>

              </div>

              <div className="bg-[#1c1924] rounded-xl p-6">

                <p className="text-gray-400">
                  External Website
                </p>

                <a
                  href={profile.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 break-all"
                >
                  {profile.externalUrl || "No Website"}
                </a>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}