"use client";

import React from "react";
import { Bookmark, Heart, ExternalLink, Calendar, MapPin } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
          <Bookmark className="w-8 h-8 mr-3 text-violet-400" />
          Saved Jobs & Posts
        </h1>
        <p className="text-muted-foreground text-sm">
          Bookmark postings from the community feed or AI job search to keep track of your active applications.
        </p>
      </div>

      {/* Mock lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Saved Jobs Segment */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white tracking-wide uppercase border-b border-border pb-2">
            Saved Jobs
          </h2>
          
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-sm">SDE 2 (React Native & Node)</h3>
                <p className="text-xs text-violet-400 font-semibold mt-0.5">Expedia Group</p>
              </div>
              <span className="text-[10px] text-muted-foreground bg-accent/40 px-2 py-0.5 rounded border border-border">
                jsearch
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Expedia is hiring engineers to lead development on the mobile bookings page.
            </p>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-border">
              <span className="text-muted-foreground flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-violet-400" />
                Gurugram, India
              </span>
              <a
                href="https://expediagroup.com"
                target="_blank"
                className="text-violet-400 hover:underline flex items-center font-medium"
              >
                Apply Link <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Saved Posts Segment */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white tracking-wide uppercase border-b border-border pb-2">
            Saved Community Posts
          </h2>

          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3">
            <div className="flex items-center space-x-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Sarah"
                className="w-6 h-6 rounded-full border border-border"
              />
              <div>
                <h4 className="text-xs font-semibold text-white">Sarah Jenkins</h4>
                <p className="text-[10px] text-muted-foreground">CTO @ JobLens</p>
              </div>
            </div>

            <h3 className="font-bold text-white text-sm mt-2">
              Looking for a Founding Engineer (FastAPI + React)
            </h3>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-border">
              <span className="text-muted-foreground flex items-center">
                <Heart className="w-3 h-3 mr-1 text-red-400 fill-current" />
                57 Likes
              </span>
              <span className="text-muted-foreground flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-violet-400" />
                Saved today
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
