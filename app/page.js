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
  ArrowUp,
  Paperclip,
  X,
  ChevronDown,
  RotateCcw,
  Check,
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

  const handleNewSummary = () => {
    setText("");
    setSummary("");
    setPdfFile(null);
  };

  return (
    <main className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-700 selection:text-white relative">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-white/[0.05] to-transparent blur-[120px] rounded-full" />
      </div>
      {/* ChatGPT Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-black/60 border-b border-neutral-900 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-neutral-200" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-violet-400">
            Para AI
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-violet-300 border border-neutral-800 hidden sm:inline-block animate-pulse cursor-pointer">
            Anurag Developers
          </span>
        </div>

        {(summary || text || pdfFile) && (
          <button
            onClick={handleNewSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-violet-300 hover:text-violet-400 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
            title="Start new summary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New summary</span>
          </button>
        )}
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col justify-between py-6 relative z-10">
        {!summary ? (
          /* Premium Animated Hero Section */
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.18,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="flex flex-col items-center"
            >
              {/* Animated Icon */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 25, scale: 0.7, rotate: -12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    transition: {
                      type: "spring",
                      stiffness: 180,
                      damping: 14,
                    },
                  },
                }}
                animate={{
                  y: [0, -7, 0],
                }}
                className="relative mb-8"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-5 rounded-[2rem] bg-violet-500/20 blur-2xl animate-pulse" />

                {/* Icon Container */}
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 via-neutral-900 to-indigo-500/20 border border-violet-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                  <Sparkles className="w-9 h-9 text-violet-300" />
                </div>
              </motion.div>

              {/* Heading Reveal */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 25, filter: "blur(10px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.8, ease: "easeOut" },
                  },
                }}
                className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4"
              >
                What would you like to{" "}
                <span className="bg-gradient-to-r from-violet-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                  summarize?
                </span>
              </motion.h1>

              {/* Description Reveal */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: "easeOut" },
                  },
                }}
                className="text-neutral-400 text-sm sm:text-base max-w-md leading-relaxed"
              >
                Paste your content or attach a PDF to transform complex
                information into clear, structured, actionable insights.
              </motion.p>

              {/* Animated Accent */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
                className="mt-8 h-px w-32 origin-center bg-gradient-to-r from-transparent via-violet-400/70 to-transparent"
              />
            </motion.div>
          </div>
        ) : (
          /* Conversation Thread (ChatGPT style message stream) */
          <div className="flex-1 space-y-6 pt-2 pb-6">
            {/* User Query Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="bg-[#262626] text-neutral-200 text-sm sm:text-base rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%] border border-neutral-700/60 shadow-sm">
                {pdfFile ? (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-300 shrink-0" />
                    <span className="font-medium text-white truncate max-w-[240px]">
                      {pdfFile.name}
                    </span>
                    <span className="text-xs text-neutral-400">({length})</span>
                  </div>
                ) : (
                  <div>
                    <p className="leading-relaxed whitespace-pre-wrap break-words">
                      {text}
                    </p>
                    <span className="text-[11px] text-neutral-400 block mt-1.5 font-medium capitalize">
                      {length} summary
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Assistant AI Response Message */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3.5 sm:gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-neutral-200" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm text-violet-400">
                    Para AI
                  </span>
                </div>

                <div className="text-neutral-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap bg-neutral-950/40 border border-neutral-800/80 rounded-2xl p-5 sm:p-6 shadow-inner font-normal">
                  {summary}
                </div>

                {/* Response Action Toolbar (Copy button) */}
                <div className="flex items-center gap-3 mt-3 pt-1">
                  <button
                    onClick={() => {
                      if (!summary) return;
                      navigator.clipboard.writeText(summary);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      copied
                        ? "bg-neutral-800 text-white border border-neutral-700"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-850"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <span className="text-neutral-600 text-xs">•</span>
                  <span className="text-xs text-neutral-500 capitalize">
                    {length} summary
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ChatGPT Style Floating Prompt Bar */}
        <div className="w-full mt-auto pt-4">
          <div className="bg-[#212121] border border-neutral-700/80 focus-within:border-neutral-500 rounded-[26px] p-3 shadow-2xl transition-all duration-200">
            {/* Attached File Chip (if PDF selected) */}
            {pdfFile && (
              <div className="inline-flex items-center gap-2 bg-[#2d2d2d] border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-200 mb-2 max-w-full">
                <FileText className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span className="truncate max-w-[200px] font-medium">
                  {pdfFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  className="text-neutral-400 hover:text-white p-0.5 rounded-md hover:bg-neutral-700 transition-colors ml-1"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !loading) {
                  e.preventDefault();
                  handleSummarize();
                }
              }}
              placeholder="Paste your text here or attach a PDF..."
              rows={pdfFile ? 2 : 3}
              className="w-full bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base resize-none focus:outline-none px-2 py-1 leading-relaxed"
            />

            {/* Bottom Controls Row inside Prompt Box */}
            <div className="flex items-center justify-between pt-2 px-1">
              <div className="flex items-center gap-2">
                {/* PDF Upload Button */}
                <label
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white bg-[#2d2d2d] hover:bg-[#383838] border border-neutral-700/80 cursor-pointer transition-colors"
                  title="Upload PDF document"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Attach PDF</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>

                {/* Summary Length Dropdown Pill */}
                <div className="relative flex items-center">
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="appearance-none bg-[#2d2d2d] hover:bg-[#383838] border border-neutral-700/80 text-xs font-medium text-neutral-300 hover:text-white rounded-full pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none transition-colors"
                  >
                    <option value="short" className="bg-[#212121] text-white">
                      Short summary
                    </option>
                    <option value="medium" className="bg-[#212121] text-white">
                      Medium summary
                    </option>
                    <option
                      value="detailed"
                      className="bg-[#212121] text-white"
                    >
                      Detailed summary
                    </option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2.5 pointer-events-none" />
                </div>
              </div>

              {/* ChatGPT Signature Circular Send Button */}
              <button
                onClick={handleSummarize}
                disabled={loading || (!text.trim() && !pdfFile)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  (text.trim() || pdfFile) && !loading
                    ? "bg-violet-300 text-black hover:bg-violet-400 shadow-md cursor-pointer"
                    : "bg-[#2f2f2f] text-neutral-500 cursor-not-allowed"
                }`}
                title="Generate summary"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-violet-300" />
                ) : (
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-neutral-400 mt-2.5">
            Para AI can analyze long articles and PDFs. Press{" "}
            <kbd className="font-mono text-neutral-300">Enter</kbd> to
            summarize,{" "}
            <kbd className="font-mono text-neutral-300">Shift + Enter</kbd> for
            new line.
          </p>
        </div>
      </div>
    </main>
  );
}
