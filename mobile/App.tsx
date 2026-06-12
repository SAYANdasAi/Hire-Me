import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Linking,
  Alert
} from 'react-native';

interface Post {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
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
    tags: ["Full-time", "Remote", "AI", "FastAPI"],
    applyUrl: "https://joblens.ai/careers/founding-engineer",
    likesCount: 57,
    createdAt: "2h ago",
    location: "Bangalore / Remote"
  },
  {
    id: "2",
    title: "Senior Product Designer (Contract to Full)",
    body: "Linear is expanding! We are seeking a senior product designer to join our design systems team. You should have a strong portfolio demonstrating sleek micro-interactions, clean system-level thinking, and outstanding visual craft. 3-month contract starting immediately, with transition to full-time.",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    authorRole: "Head of Product Design @ Linear",
    tags: ["Contract", "Remote", "Design System"],
    applyUrl: "https://linear.app/careers/senior-product-designer",
    likesCount: 124,
    createdAt: "5h ago",
    location: "San Francisco / Remote"
  },
  {
    id: "3",
    title: "Backend Engineer - High Scale Systems (Go/Rust)",
    body: "Supabase is looking for a systems engineer to join our database infrastructure squad. If you love working on PostgreSQL internals, connection poolers, and optimizing transaction latency at high scale, we want to talk to you. Passion for open source is a massive plus.",
    authorName: "Antony Cooper",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    authorRole: "Lead Database Architect @ Supabase",
    tags: ["Full-time", "Hybrid", "PostgreSQL", "Go"],
    applyUrl: "https://supabase.com/careers/backend-systems-engineer",
    likesCount: 38,
    createdAt: "1d ago",
    location: "Singapore / Hybrid"
  }
];

const AVAILABLE_TAGS = ["All", "Full-time", "Remote", "Hybrid", "AI", "FastAPI", "Design System", "PostgreSQL", "Go"];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    const isCurrentlyLiked = !!likedPosts[id];
    setLikedPosts(prev => ({ ...prev, [id]: !isCurrentlyLiked }));
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id
          ? { ...post, likesCount: post.likesCount + (isCurrentlyLiked ? -1 : 1) }
          : post
      )
    );
  };

  const handleSave = (id: string) => {
    setSavedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApply = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open apply link.");
    });
  };

  const handleCreatePostAlert = () => {
    Alert.alert("Authentication Required", "Please sign in to publish opportunities.");
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "All" ||
      post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>JobLens</Text>
          <Text style={styles.subTitleText}>Community Feed</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePostAlert}>
          <Text style={styles.createButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search opportunities or roles..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Horizontal Tag Selector */}
      <View style={styles.tagsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
          {AVAILABLE_TAGS.map(tag => {
            const isSelected = selectedTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagButton, isSelected && styles.tagButtonSelected]}
                onPress={() => setSelectedTag(tag)}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Posts FlatList */}
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isLiked = !!likedPosts[item.id];
          const isSaved = !!savedPosts[item.id];
          return (
            <View style={styles.card}>
              {/* Author Row */}
              <View style={styles.authorRow}>
                <Image source={{ uri: item.authorAvatar }} style={styles.avatar} />
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{item.authorName}</Text>
                  <Text style={styles.authorRole}>{item.authorRole}</Text>
                </View>
                <Text style={styles.timeText}>{item.createdAt}</Text>
              </View>

              {/* Title & Body */}
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody} numberOfLines={4}>
                {item.body}
              </Text>

              {/* Location & Tags */}
              <View style={styles.metaRow}>
                <Text style={styles.locationText}>📍 {item.location}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardTagsScroll}>
                  {item.tags.map(t => (
                    <View key={t} style={styles.cardTag}>
                      <Text style={styles.cardTagText}>{t}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Actions Row */}
              <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                  {/* Like Button */}
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
                    <Text style={[styles.actionButtonText, isLiked && styles.likedText]}>
                      {isLiked ? '❤️' : '🤍'} {item.likesCount}
                    </Text>
                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleSave(item.id)}>
                    <Text style={[styles.actionButtonText, isSaved && styles.savedText]}>
                      {isSaved ? '⭐️ Saved' : '☆ Save'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Apply Button */}
                <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(item.applyUrl)}>
                  <Text style={styles.applyButtonText}>Apply Link ↗</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No job posts found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090e1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a78bfa',
  },
  subTitleText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: '#f8fafc',
    fontSize: 14,
  },
  tagsWrapper: {
    marginBottom: 8,
  },
  tagsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  tagButton: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  tagButtonSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  tagText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  authorInfo: {
    flex: 1,
    marginLeft: 10,
  },
  authorName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  authorRole: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 1,
  },
  timeText: {
    color: '#64748b',
    fontSize: 11,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBody: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '500',
    marginRight: 10,
  },
  cardTagsScroll: {
    flex: 1,
  },
  cardTag: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  cardTagText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  actionButtonText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  likedText: {
    color: '#f87171',
    fontWeight: '500',
  },
  savedText: {
    color: '#a78bfa',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
});
