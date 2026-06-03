"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Copy,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState("medium");
  const [copied, setCopied] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const handleSummarize = async () => {
    if (!text.trim() && !pdfFile) {
      alert("Please enter text or upload a PDF");
      return;
    }

    try {
      setLoading(true);

      let response;

      if (pdfFile) {
        const formData = new FormData();

        formData.append("file", pdfFile);
        formData.append("length", length);

        response = await fetch("/api/upload-pdf", {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            length,
          }),
        });
      }

      const responseText = await response.text();

      console.log(responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize");
      }

      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      alert("Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4 text-indigo-600 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight mb-4">
            Para AI
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Transform lengthy documents into clear, concise insights in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-4 h-4 text-indigo-500" />
                Paste Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your content here..."
                className="w-full h-48 border border-gray-200 rounded-2xl p-5 resize-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 bg-gray-50/50 hover:bg-gray-50 text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <UploadCloud className="w-4 h-4 text-indigo-500" />
                  Upload PDF
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 bg-gray-50/50 group-hover:bg-indigo-50/50 group-hover:border-indigo-300 transition-all duration-300 h-[72px]">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-sm text-gray-500 group-hover:text-indigo-600 font-medium truncate max-w-[150px]">
                        {pdfFile ? pdfFile.name : "Choose PDF"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Summary Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl p-4 bg-gray-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 text-gray-700 appearance-none font-medium cursor-pointer h-[72px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: `right 1rem center`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `1.5em 1.5em`,
                  }}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSummarize}
              disabled={loading}
              className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Summary
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 mt-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />

          <div className="flex items-center justify-between mb-6 pl-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Your Summary
            </h2>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!summary) return;
                navigator.clipboard.writeText(summary);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              disabled={!summary}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                copied
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </motion.button>
          </div>

          <div className="pl-2">
            {summary ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {summary}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mb-3 opacity-20" />
                <p>Your AI-generated summary will appear here...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
