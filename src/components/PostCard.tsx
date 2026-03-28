import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tables } from '@/integrations/supabase/types';

interface PostCardProps {
  post: Tables<'posts'> & {
    profiles?: { display_name: string | null; avatar_url: string | null } | null;
    likes_count?: number;
    user_has_liked?: boolean;
  };
  onRefresh?: () => void;
}

const PostCard = ({ post, onRefresh }: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<(Tables<'comments'> & { profiles?: { display_name: string | null } | null })[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(post.user_has_liked ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);

  const toggleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('post_id', post.id);
      setLiked(false);
      setLikesCount((c) => c - 1);
    } else {
      await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
      setLiked(true);
      setLikesCount((c) => c + 1);
    }
  };

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles:user_id(display_name)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const handleToggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    await supabase.from('comments').insert({ user_id: user.id, post_id: post.id, content: newComment.trim() });
    setNewComment('');
    loadComments();
  };

  const displayName = post.profiles?.display_name || 'Usuário';
  const avatarUrl = post.profiles?.avatar_url || '';

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex-row items-center gap-3 space-y-0 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-display">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{displayName}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <img src={post.image_url} alt="" className="mt-3 rounded-lg max-h-96 w-full object-cover" loading="lazy" />
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 pt-0">
        <div className="flex items-center gap-4 border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={toggleLike} className={liked ? 'text-destructive' : ''}>
            <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} /> {likesCount}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToggleComments}>
            <MessageCircle className="h-4 w-4 mr-1" /> Comentários
          </Button>
        </div>
        {showComments && (
          <div className="space-y-3 animate-fade-in">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2 text-sm">
                <span className="font-semibold shrink-0">{c.profiles?.display_name || 'Usuário'}:</span>
                <span className="text-muted-foreground">{c.content}</span>
              </div>
            ))}
            {user && (
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="min-h-[40px] text-sm resize-none"
                  rows={1}
                />
                <Button size="icon" variant="ghost" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
