"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Cpu, Award, Users, FileText, CheckCircle2, ChevronDown } from "lucide-react";

interface Stage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  imagePath: string;
  linkPath: string;
  linkText: string;
  icon: React.ReactNode;
}

const STAGES: Stage[] = [
  {
    id: "1",
    title: "Semantic Job Discovery",
    subtitle: "Phase 1: Explore Opportunities",
    description: "Type natural phrases like 'mid level SDE in Bangalore' or 'Remote React Designer'. Our FastAPI microservice parses your intent, extracts keywords, and structures raw search outputs into opinionated Gemini job summaries.",
    bullets: [
      "10-second decisions: no 15-tab browsing",
      "Intent guard checks queries to filter off-topic noise",
      "Consistent, structured job summary layouts"
    ],
    imagePath: "/ai_job_search_stage.png",
    linkPath: "/search",
    linkText: "Try AI Job Search",
    icon: <Cpu className="w-6 h-6 text-violet-400" />
  },
  {
    id: "2",
    title: "ATS Resume Optimizer",
    subtitle: "Phase 2: Close the Gap",
    description: "Upload your resume in PDF or DOCX format. Scan it instantly against target job descriptions to calculate an ATS score, identify key skill gaps, rewrite bullet points with Gemini, and download a styled PDF.",
    bullets: [
      "0–100 ATS scoring with clear feedback",
      "Keyword-gap analysis based on the JD",
      "Inline Gemini rewrites to naturally inject skills",
      "HTML-to-PDF formatting ready for submission"
    ],
    imagePath: "/resume_optimizer_stage.png",
    linkPath: "/resume",
    linkText: "Open Resume Optimizer",
    icon: <FileText className="w-6 h-6 text-blue-400" />
  },
  {
    id: "3",
    title: "Community Opportunities Feed",
    subtitle: "Phase 3: Network & Connect",
    description: "Connect with founders and recruiters posting real opportunities. Share opportunities, save listings, like posts, and apply via direct links. A clean professional feed built for job matching.",
    bullets: [
      "Infinite scrolling sorted by engagement and recency",
      "Interactive post creation forms with tags",
      "Saved jobs dashboard to track applications"
    ],
    imagePath: "/community_feed_stage.png",
    linkPath: "/feed",
    linkText: "Explore Community Feed",
    icon: <Users className="w-6 h-6 text-emerald-400" />
  }
];

// Helper Scroll Fade Component using IntersectionObserver
function StageSection({ stage, index }: { stage: Stage; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={domRef}
      className={`grid grid-cols-1 lg:grid-cols-9 gap-8 items-center py-16 transition-all duration-1000 transform ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16"
      }`}
    >
      {/* Content Side */}
      <div className={`lg:col-span-4 ${isEven ? "lg:order-1" : "lg:order-5 lg:col-start-6"}`}>
        <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-6 relative overflow-hidden group hover:border-violet-500/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all" />
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
              {stage.icon}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                {stage.subtitle}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {stage.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {stage.description}
          </p>

          <ul className="space-y-2">
            {stage.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start text-xs text-muted-foreground leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <Link
            href={stage.linkPath}
            className="inline-flex items-center text-xs font-bold px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 group-hover:scale-[1.02]"
          >
            {stage.linkText}
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </div>
      </div>

      {/* Connection Indicator Node (Desktop central space) */}
      <div className="hidden lg:flex lg:col-span-1 justify-center lg:order-3">
        <div className={`w-8 h-8 rounded-full border-4 border-background flex items-center justify-center transition-all duration-1000 ${
          isVisible ? "bg-violet-500 scale-110 shadow-lg shadow-violet-500/50" : "bg-muted"
        }`}>
          <span className="text-[10px] font-bold text-white">{index + 1}</span>
        </div>
      </div>

      {/* Image Illustration Side */}
      <div className={`lg:col-span-4 ${isEven ? "lg:order-5" : "lg:order-1"}`}>
        <div className="glass-card rounded-3xl p-3 border border-white/5 overflow-hidden group hover:scale-[1.01] transition-transform">
          <img
            src={stage.imagePath}
            alt={stage.title}
            className="w-full h-auto rounded-2xl object-cover border border-white/5 shadow-2xl transition-all duration-500 group-hover:brightness-110"
          />
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrolled = (window.scrollY / totalHeight) * 100;
        setScrollProgress(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPathway = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth"
    });
  };

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="space-y-6 max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400 text-glow">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Empowering Your Career Journey
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Supercharge Your Job Search with{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              HireMe
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            One cohesive pathway to discover AI job summaries, run ATS resume gap analysis, and connect with recruiter networks instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={scrollToPathway}
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-105"
            >
              Explore the Pathway
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <Link
              href="/feed"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-full transition-all flex items-center justify-center"
            >
              Jump to Feed
            </Link>
          </div>
        </div>

        <button
          onClick={scrollToPathway}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer animate-bounce"
        >
          Scroll to pathway
          <ChevronDown className="w-4 h-4 mt-1" />
        </button>
      </section>

      {/* Main Roadmap Section */}
      <section className="relative max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            The Job Hunt Pathway
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Interactive roadmap tracking your milestones from search discovery to resume gap closure and community hiring channels.
          </p>
        </div>

        {/* Central Tracking Line (Desktop only) */}
        <div className="hidden lg:block absolute top-[280px] bottom-[280px] left-1/2 transform -translate-x-1/2 w-0.5 bg-slate-800 pointer-events-none">
          {/* Scrolling progress line indicator */}
          <div
            style={{ height: `${scrollProgress}%` }}
            className="w-full bg-gradient-to-b from-violet-500 to-indigo-500 shadow-[0_0_10px_#8b5cf6] transition-all duration-75"
          />
        </div>

        {/* Stages list */}
        <div className="relative space-y-12">
          {STAGES.map((stage, idx) => (
            <StageSection key={stage.id} stage={stage} index={idx} />
          ))}

          {/* Phase 4: Final Success node */}
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-8 items-center py-16">
            <div className="lg:col-span-4 lg:col-start-3 lg:col-end-8 text-center space-y-6">
              {/* Central node block */}
              <div className="hidden lg:flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/50 animate-pulse border-4 border-background">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Premium stage details card */}
              <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-6 relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Phase 4: Land & Succeed
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  Unlock Premium Success
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Accelerate your hiring potential. Unlock daily alert digests via Resend email logs, boost your community listings, read recruiter view analytics, and run unlimited ATS resume gap optimizer scans.
                </p>

                {/* Premium features checklist grid */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left text-xs pt-4 border-t border-border">
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
                    Unlimited ATS scans
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
                    Analytics Dashboard
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
                    Daily search digests
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
                    Boosted feed listings
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/saved"
                    className="inline-flex items-center text-xs font-bold px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white transition-all shadow-md shadow-indigo-500/20"
                  >
                    Go Premium via Razorpay
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
