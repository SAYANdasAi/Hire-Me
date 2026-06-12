"use client";

import React, { useState } from "react";
import { Search, MapPin, DollarSign, Briefcase, Cpu, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  summary: string;
  company_overview: string;
  experience_required: string;
  tech_stack: string[];
  why_apply: string;
  applyUrl: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<JobResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [parsedCriteria, setParsedCriteria] = useState<{ role?: string; level?: string; location?: string } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setResults([]);
    setParsedCriteria(null);

    try {
      // 1. Hit intent guard
      const guardRes = await fetch("http://127.0.0.1:8000/jobs/intent-guard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const guardData = await guardRes.json();

      if (!guardData.is_job_search) {
        setErrorMsg(guardData.redirect_message || "Off-topic query detected.");
        setLoading(false);
        return;
      }

      // 2. Parse query
      const parseRes = await fetch("http://127.0.0.1:8000/jobs/parse-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const parseData = await parseRes.json();
      setParsedCriteria({
        role: parseData.role || undefined,
        level: parseData.level || undefined,
        location: parseData.location || undefined,
      });

      // 3. Mock fetching structured jobs based on parsed data, then summarize them
      // In a full implementation, we fetch from Jsearch/SerpAPI and then call FastAPI summarize.
      // Here, we simulate the fetch pipeline by creating 2 mock job entries matching the parsed keywords and calling FastAPI /jobs/summarize.
      const mockJobsRaw = [
        {
          title: `${parseData.level || "Senior"} ${parseData.role || "Software Engineer"}`,
          company: "Vercel",
          location: parseData.location || "Remote",
          salary: "$140,000 - $180,000",
          description: "Looking for an engineer to help us scale serverless Edge functions. Must have deep React, Next.js, Node.js, and TypeScript skills. PostgreSQL knowledge is a plus. You will work on optimizing cold start times and building APIs.",
          applyUrl: "https://vercel.com/careers"
        },
        {
          title: `Backend Developer (${parseData.role || "SDE"})`,
          company: "Neon DB",
          location: parseData.location || "Bengaluru",
          salary: "₹18,000,00 - ₹25,000,00",
          description: "Join the database scaling squad. Experience with FastAPI, Python, PostgreSQL, serverless database adapters, and Redis caching. You will own session management APIs and latency optimizations.",
          applyUrl: "https://neon.tech/careers"
        }
      ];

      const summarizedResults: JobResult[] = [];

      for (let i = 0; i < mockJobsRaw.length; i++) {
        const job = mockJobsRaw[i];
        const sumRes = await fetch("http://127.0.0.1:8000/jobs/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: job.title,
            company: job.company,
            description: job.description,
            location: job.location,
            salary: job.salary,
          }),
        });
        const sumData = await sumRes.json();
        summarizedResults.push({
          id: (i + 1).toString(),
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          experience: sumData.experience_required || "3+ years",
          summary: sumData.summary,
          company_overview: sumData.company_overview,
          experience_required: sumData.experience_required,
          tech_stack: sumData.tech_stack,
          why_apply: sumData.why_apply,
          applyUrl: job.applyUrl,
        });
      }

      setResults(summarizedResults);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to communicate with AI Service. Make sure your FastAPI backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          AI Job Discovery Engine
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Type a role and location in free-text format. We parse your intent, fetch real-time listings, and generate summarized cards using Gemini.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </span>
          <input
            type="text"
            required
            placeholder="e.g. SDE 2 Bangalore, Senior UI Designer Remote..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl text-base text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 bg-primary text-primary-foreground font-semibold rounded-2xl transition-all hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Discover"}
        </button>
      </form>

      {/* Intent Guard Warm Redirect Alert */}
      {errorMsg && (
        <div className="glass-card border-amber-500/20 bg-amber-500/5 rounded-2xl p-6 flex items-start space-x-3 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-300">Search Guard Message</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {errorMsg}
            </p>
          </div>
        </div>
      )}

      {/* Parsing Criteria Badges */}
      {parsedCriteria && (
        <div className="flex flex-wrap gap-2 justify-center text-xs">
          <span className="text-muted-foreground mr-1 self-center">AI Parsed Intent:</span>
          {parsedCriteria.role && (
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium">
              Role: {parsedCriteria.role}
            </span>
          )}
          {parsedCriteria.level && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
              Level: {parsedCriteria.level}
            </span>
          )}
          {parsedCriteria.location && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              Location: {parsedCriteria.location}
            </span>
          )}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-6 space-y-4 animate-skeleton">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
                <div className="h-8 bg-muted rounded w-20" />
              </div>
              <div className="h-16 bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-5 bg-muted rounded w-16" />
                <div className="h-5 bg-muted rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summarized Job Results Grid */}
      <div className="space-y-6">
        {results.map((job) => (
          <div key={job.id} className="glass-card rounded-3xl p-8 hover:border-violet-500/20 transition-all space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-violet-400">{job.company}</span>
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {job.location}</span>
                  <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-0.5" /> {job.salary}</span>
                  <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1" /> {job.experience}</span>
                </div>
              </div>
              
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center self-start shadow-md shadow-primary/10"
              >
                Apply Now
              </a>
            </div>

            {/* AI Summary Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white tracking-wider uppercase flex items-center">
                <Cpu className="w-3.5 h-3.5 mr-1.5 text-violet-400" />
                Gemini AI Summary
              </h4>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {job.summary}
              </p>
            </div>

            {/* Company & Experience Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase">Company Overview</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{job.company_overview}</p>
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase">Background Needed</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{job.experience_required}</p>
              </div>
            </div>

            {/* Why Apply & Tech Stack */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-border/60">
              {/* Tech Stack */}
              <div className="space-y-2 flex-1">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase">Tech Stack</h5>
                <div className="flex flex-wrap gap-1.5">
                  {job.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-accent/40 border border-border text-xs text-purple-300 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why Apply */}
              <div className="space-y-2 flex-1">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Why Apply
                </h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{job.why_apply}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
