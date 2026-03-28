import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type PostWithMeta = Tables<'posts'> & {
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
  likes_count?: number;
  user_has_liked?: boolean;
};

const FeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  const loadPosts = useCallback(async () => {
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!postsData) { setPosts([]); return; }

    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const postIds = postsData.map(p => p.id);

    const [profilesRes, likesRes, userLikesRes] = await Promise.all([
      supabase.from('profiles').select('user_id, display_name, avatar_url').in('user_id', userIds),
      supabase.from('likes').select('post_id').in('post_id', postIds),
      user ? supabase.from('likes').select('post_id').eq('user_id', user.id).in('post_id', postIds) : Promise.resolve({ data: [] }),
    ]);

    const profileMap = new Map(profilesRes.data?.map(p => [p.user_id, p]) || []);
    const likesCountMap = new Map<string, number>();
    likesRes.data?.forEach(l => likesCountMap.set(l.post_id, (likesCountMap.get(l.post_id) || 0) + 1));
    const userLikedSet = new Set(userLikesRes.data?.map(l => l.post_id) || []);

    setPosts(postsData.map(p => ({
      ...p,
      profiles: profileMap.get(p.user_id) || null,
      likes_count: likesCountMap.get(p.id) || 0,
      user_has_liked: userLikedSet.has(p.id),
    })));
  }, [user]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;
    setPosting(true);
    const { error } = await supabase.from('posts').insert({ user_id: user.id, content: newPost.trim() });
    setPosting(false);
    if (error) toast.error('Erro ao publicar');
    else { setNewPost(''); loadPosts(); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-8">Feed</h1>

        {user && (
          <Card className="mb-8 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground font-display">
                    {(user.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="O que está acontecendo?"
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handlePost} variant="hero" size="sm" disabled={posting || !newPost.trim()}>
                      <Send className="h-4 w-4 mr-2" /> {posting ? 'Publicando...' : 'Publicar'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Nenhuma publicação ainda. Seja o primeiro!</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} onRefresh={loadPosts} />)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedPage;
