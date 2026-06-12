"use client";

import React, { useState } from "react";
import { Heart, Bookmark, Search, PlusCircle, ExternalLink, Filter, MapPin, Tag } from "lucide-react";

interface Post {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  imageUrls: string[];
  tags: string[];
  applyUrl: string;
  likesCount: number;
  createdAt: string;
  location: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    title: "Looking for a Founding Engineer (FastAPI + React)",
    body: "We are building the next generation of career discovery tools here at JobLens. Looking for a full-stack engineer who is passionate about AI, semantic search, and building high-performance web and mobile apps. You will work directly with the founders and own major parts of the product.",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    authorRole: "Co-Founder & CTO @ JobLens",
    imageUrls: [],
    tags: ["Full-time", "Remote", "AI", "FastAPI"],
    applyUrl: "https://joblens.ai/careers/founding-engineer",
    likesCount: 57,
    createdAt: "2 Hours ago",
    location: "Bangalore / Remote"
  },
  {
    id: "2",
    title: "Senior Product Designer (Contract to Full-Time)",
    body: "Linear is expanding! We are seeking a senior product designer to join our design systems team. You should have a strong portfolio demonstrating sleek visual design, micro-interactions, clean system-level thinking, and outstanding craftsmanship. 3-month contract starting immediately, with transition to full-time.",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    authorRole: "Head of Product Design @ Linear",
    imageUrls: [],
    tags: ["Contract", "Remote", "Design System"],
    applyUrl: "https://linear.app/careers/senior-product-designer",
    likesCount: 124,
    createdAt: "5 Hours ago",
    location: "San Francisco / Remote"
  },
  {
    id: "3",
    title: "Backend Engineer - High Scale Systems (Go/Rust)",
    body: "Supabase is looking for a systems engineer to join our database infrastructure squad. If you love working on PostgreSQL internals, connection poolers, and optimizing transaction latency at high scale, we want to talk to you. Passion for open source is a massive plus.",
    authorName: "Antony Cooper",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    authorRole: "Lead Database Architect @ Supabase",
    imageUrls: [],
    tags: ["Full-time", "Hybrid", "PostgreSQL", "Go"],
    applyUrl: "https://supabase.com/careers/backend-systems-engineer",
    likesCount: 38,
    createdAt: "1 Day ago",
    location: "Singapore / Hybrid"
  }
];

const AVAILABLE_TAGS = ["All", "Full-time", "Remote", "Hybrid", "AI", "FastAPI", "Design System", "PostgreSQL", "Go"];

export default function FeedPage() {
  const isSignedIn = true; // Auto-auth enabled to display UI and interactive controls
  
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  
  // Create Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [newPostApplyUrl, setNewPostApplyUrl] = useState("");

  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const isCurrentlyLiked = !!prev[id];
      setPosts((pList) =>
        pList.map((post) =>
          post.id === id
            ? { ...post, likesCount: post.likesCount + (isCurrentlyLiked ? -1 : 1) }
            : post
        )
      );
      return { ...prev, [id]: !isCurrentlyLiked };
    });
  };

  const handleSave = (id: string) => {
    setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPostTitle || !newPostContent || !newPostApplyUrl) {
      alert("Please fill in required fields.");
      return;
    }

    const newPost: Post = {
      id: (posts.length + 1).toString(),
      title: newPostTitle,
      body: newPostContent,
      authorName: "Alex Carter",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      authorRole: "Product Designer @ JobLens",
      imageUrls: [],
      tags: newPostTags.split(",").map(t => t.trim()).filter(Boolean),
      applyUrl: newPostApplyUrl,
      likesCount: 0,
      createdAt: "Just now",
      location: newPostLocation || "Remote"
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    
    // Clear inputs
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTags("");
    setNewPostLocation("");
    setNewPostApplyUrl("");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "All" ||
      post.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold tracking-wide text-white mb-4 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-violet-400" />
              Filter Opportunities
            </h2>
            
            {/* Search Box */}
            <div className="relative mb-6">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </span>
              <input
                type="text"
                placeholder="Search posts or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/60 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
              />
            </div>

            {/* Tag Buttons */}
            <div className="space-y-1">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center">
                    <Tag className="w-3.5 h-3.5 mr-2 opacity-75" />
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="glass-card rounded-2xl p-6 hidden lg:block">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs bg-muted border border-border rounded text-muted-foreground">#FastAPI</span>
              <span className="px-2 py-1 text-xs bg-muted border border-border rounded text-muted-foreground">#Nextjs14</span>
              <span className="px-2 py-1 text-xs bg-muted border border-border rounded text-muted-foreground">#React</span>
              <span className="px-2 py-1 text-xs bg-muted border border-border rounded text-muted-foreground">#Rust</span>
            </div>
          </div>
        </aside>

        {/* Main Feed Section */}
        <section className="lg:col-span-3 space-y-6">
          {/* Post Creation Header */}
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Community Board
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Recruiters and founders posting real roles. Click apply directly.
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full transition-all hover:scale-105 hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Post Opportunity
            </button>
          </div>

          {/* Post Cards Grid */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="glass-card rounded-2xl p-6 transition-all hover:border-violet-500/30 group">
                  {/* Author Metadata */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full border border-border"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{post.authorName}</h4>
                        <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                  </div>

                  {/* Post Title & Body */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-wrap">
                    {post.body}
                  </p>

                  {/* Location & Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                    <div className="flex items-center text-muted-foreground mr-2">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-violet-400" />
                      {post.location}
                    </div>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-accent/40 border border-border text-purple-300 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex space-x-4">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center text-sm font-medium transition-colors ${
                          likedPosts[post.id]
                            ? "text-red-400"
                            : "text-muted-foreground hover:text-red-400"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 mr-1.5 transition-transform ${
                            likedPosts[post.id] ? "fill-current scale-110" : ""
                          }`}
                        />
                        {post.likesCount}
                      </button>

                      {/* Save Button */}
                      <button
                        onClick={() => handleSave(post.id)}
                        className={`flex items-center text-sm font-medium transition-colors ${
                          savedPosts[post.id]
                            ? "text-violet-400"
                            : "text-muted-foreground hover:text-violet-400"
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 mr-1.5 transition-transform ${
                            savedPosts[post.id] ? "fill-current scale-110" : ""
                          }`}
                        />
                        {savedPosts[post.id] ? "Saved" : "Save"}
                      </button>
                    </div>

                    {/* Apply Button */}
                    <a
                      href={post.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs font-semibold px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/5 text-white transition-all"
                    >
                      Apply Link
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">No opportunities matched your search criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 relative border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Post a New Opportunity</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Job Title / Headline <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer (Next.js)"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Description / Body <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain the role, requirements, tech stack, and benefits..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / Bangalore"
                    value={newPostLocation}
                    onChange={(e) => setNewPostLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote, AI, SDE"
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  External Apply URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://company.com/careers/job"
                  value={newPostApplyUrl}
                  onChange={(e) => setNewPostApplyUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/60 border border-border rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
