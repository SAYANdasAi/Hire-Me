"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, RefreshCw, Download, Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function ResumePage() {
  // Score state
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [loadingScore, setLoadingScore] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    missing_keywords: string[];
    matched_keywords: string[];
    feedback: string;
  } | null>(null);

  // Rewrite state
  const [sectionName, setSectionName] = useState("Work Experience");
  const [currentText, setCurrentText] = useState("");
  const [rewriteKeywords, setRewriteKeywords] = useState("");
  const [loadingRewrite, setLoadingRewrite] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<{
    rewritten_text: string;
    changes_summary: string;
  } | null>(null);

  // Export state
  const [loadingExport, setLoadingExport] = useState(false);
  const [userName, setUserName] = useState("Alex Carter");
  const [userEmail, setUserEmail] = useState("alex.carter@example.com");
  const [userPhone, setUserPhone] = useState("+1-555-0199");
  const [userLoc, setUserLoc] = useState("Bangalore, India");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jdText.trim()) return;

    setLoadingScore(true);
    setScoreResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd_text", jdText);

    try {
      const res = await fetch("http://127.0.0.1:8000/resume/score", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Scoring failed");
      const data = await res.json();
      setScoreResult(data);

      // Pre-fill rewrite tool inputs with missing keywords to make it easier for user
      if (data.missing_keywords && data.missing_keywords.length > 0) {
        setRewriteKeywords(data.missing_keywords.slice(0, 3).join(", "));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to analyze resume. Please verify the FastAPI backend is running on port 8000.");
    } finally {
      setLoadingScore(false);
    }
  };

  const handleRewriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText.trim()) return;

    setLoadingRewrite(true);
    setRewriteResult(null);

    const missing_keywords = rewriteKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch("http://127.0.0.1:8000/resume/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionName,
          current_text: currentText,
          missing_keywords,
        }),
      });
      if (!res.ok) throw new Error("Rewrite failed");
      const data = await res.json();
      setRewriteResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to rewrite section.");
    } finally {
      setLoadingRewrite(false);
    }
  };

  const handleExportPDF = async () => {
    setLoadingExport(true);
    
    // Package resume sections
    // If user accepted rewritten text, we'll use it
    const sectionsData = {
      [sectionName]: rewriteResult ? rewriteResult.rewritten_text : (currentText || "Software developer with experience building Next.js apps."),
      "Education": "B.Tech in Computer Science\nGPA: 9.1",
      "Skills": "Next.js, TypeScript, Python, FastAPI, Prisma, PostgreSQL, Redis"
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: userPhone,
          location: userLoc,
          sections: sectionsData
        }),
      });
      if (!res.ok) throw new Error("PDF export failed");
      
      const blob = await res.blob();
      
      // Determine file extension returned
      const contentType = res.headers.get("content-type");
      const ext = contentType && contentType.includes("pdf") ? "pdf" : "html";
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `optimized_resume.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to export optimized PDF.");
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          AI Resume Optimizer
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Scan your resume against a job description, see keyword gaps, rewrite bullet points with Gemini, and download a styled PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Hand: Scan form + Results */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-violet-400" />
              1. ATS Score Scanner
            </h2>
            
            <form onSubmit={handleScoreSubmit} className="space-y-4">
              {/* File Selector */}
              <div className="border-2 border-dashed border-border hover:border-violet-500/30 rounded-2xl p-6 transition-all text-center cursor-pointer relative bg-muted/20">
                <input
                  type="file"
                  required
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-white">
                  {file ? file.name : "Select PDF or DOCX Resume"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Max file size 5MB</p>
              </div>

              {/* JD Input */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Target Job Description</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste the target job requirements or description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingScore || !file}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl transition-all hover:bg-primary/95 disabled:opacity-50 flex items-center justify-center"
              >
                {loadingScore ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Scan & Analyze Gaps
              </button>
            </form>
          </div>

          {/* Scanner Output details */}
          {scoreResult && (
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="font-bold text-white text-base">Analysis Results</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">ATS Match:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    scoreResult.score >= 80
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {scoreResult.score}%
                  </span>
                </div>
              </div>

              {/* Keyword Badges */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" />
                    Matched Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {scoreResult.matched_keywords.length > 0 ? (
                      scoreResult.matched_keywords.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None matched yet.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mr-1.5" />
                    Missing Keywords (Gap)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {scoreResult.missing_keywords.length > 0 ? (
                      scoreResult.missing_keywords.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded bg-amber-500/5 border border-amber-500/10 text-xs text-amber-400">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No critical keyword gaps!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* General Feedback */}
              <div className="bg-accent/40 border border-border rounded-xl p-4 space-y-1">
                <h5 className="text-xs font-semibold text-white">AI Feedback</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {scoreResult.feedback}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Hand: Rewrite Bullet Points + Export Section */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-violet-400" />
              2. AI Section Rewriter
            </h2>
            
            <form onSubmit={handleRewriteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Section Name</label>
                  <input
                    type="text"
                    required
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Keywords to Inject</label>
                  <input
                    type="text"
                    placeholder="e.g. FastAPI, Redis"
                    value={rewriteKeywords}
                    onChange={(e) => setRewriteKeywords(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Original Text</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste the current content of this section..."
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingRewrite || !currentText.trim()}
                className="w-full py-2.5 bg-accent text-white border border-white/10 font-semibold rounded-xl transition-all hover:bg-accent/80 disabled:opacity-50 flex items-center justify-center"
              >
                {loadingRewrite ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Generate AI Suggestion
              </button>
            </form>
          </div>

          {/* Rewrite Results display */}
          {rewriteResult && (
            <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <h4 className="font-bold text-white text-sm">Gemini AI Rewrite</h4>
                </div>
                
                {/* Original vs Rewritten Visual comparison */}
                <div className="space-y-3 text-sm">
                  <div className="text-muted-foreground line-through opacity-60 bg-muted/10 p-3 rounded-lg border border-border/30">
                    {currentText}
                  </div>
                  <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-violet-400 rotate-90" /></div>
                  <div className="text-white bg-violet-500/5 p-3 rounded-lg border border-violet-500/20 font-medium">
                    {rewriteResult.rewritten_text}
                  </div>
                </div>

                <div className="bg-accent/30 rounded-xl p-3 border border-border">
                  <h5 className="text-xs font-semibold text-white">Summary of changes:</h5>
                  <p className="text-xs text-muted-foreground mt-1">{rewriteResult.changes_summary}</p>
                </div>
              </div>

              {/* Accept & Export Segment */}
              <div className="border-t border-border pt-4 space-y-4">
                <h4 className="font-bold text-white text-sm">3. Export Optimized Resume</h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-muted-foreground mb-0.5">Contact Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-2 py-1 bg-muted/40 border border-border rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-0.5">Email</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-2 py-1 bg-muted/40 border border-border rounded text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleExportPDF}
                  disabled={loadingExport}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-violet-500/10"
                >
                  {loadingExport ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                  Export Styled PDF Document
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
