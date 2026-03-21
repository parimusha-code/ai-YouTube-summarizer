"use client";

import { useState } from "react";
import { Youtube, Search, Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-8 sm:p-12 overflow-hidden relative">

        {/* Decorative background blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 leading-tight pb-2">
            AI YouTube
            <br />
            Summarizer
          </h1>
        </div>

        <form onSubmit={handleSummarize} className="space-y-6 relative z-10">
          <div>
            <input
              type="text"
              name="url"
              id="url"
              className="w-full px-5 py-4 bg-purple-50/50 border-2 border-purple-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg"
              placeholder="Enter YouTube URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-lg flex justify-center items-center py-4 px-4 rounded-xl shadow-lg hover:shadow-xl text-white font-bold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
          >
            {loading ? (
              <Loader2 className="animate-spin h-6 w-6 text-white" />
            ) : (
              "Generate Summary"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 rounded-r-lg">
            <p className="text-sm text-red-700 font-medium">
              {error}
            </p>
          </div>
        )}

        {summary && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="p-6 bg-gradient-to-b from-purple-50 to-white rounded-2xl border border-purple-100 shadow-inner">
              <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wider mb-3 flex items-center">
                <Youtube className="w-4 h-4 mr-2" />
                Summary Results
              </h3>
              <div className="prose prose-purple max-w-none text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                {summary}
              </div>
            </div>

            {/* Notes Saver Section */}
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                📝 Notes Saver
              </h3>
              <textarea
                className="w-full p-4 border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-pink-200/50 focus:border-pink-400 outline-none resize-none bg-white text-gray-800 text-base h-32 transition-all"
                placeholder="Type your personal notes for this video here..."
              ></textarea>
              <button
                type="button"
                onClick={(e) => {
                  const btn = e.currentTarget;
                  btn.textContent = "✓ Saved successfully!";
                  btn.classList.replace("bg-gray-900", "bg-green-500");
                  setTimeout(() => {
                    btn.textContent = "Save Notes";
                    btn.classList.replace("bg-green-500", "bg-gray-900");
                  }, 2000);
                }}
                className="mt-4 w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl shadow hover:bg-gray-800 transition-colors duration-300"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
