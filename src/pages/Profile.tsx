import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ display_name: '', bio: '', location: '', avatar_url: '', skills: '' });

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data);
        setForm({
          display_name: data.display_name || '',
          bio: data.bio || '',
          location: data.location || '',
          avatar_url: data.avatar_url || '',
          skills: (data.skills || []).join(', '),
        });
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({
      display_name: form.display_name,
      bio: form.bio,
      location: form.location,
      avatar_url: form.avatar_url,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
    }).eq('user_id', user.id);
    setLoading(false);
    if (error) toast.error('Erro ao salvar');
    else toast.success('Perfil atualizado!');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-8">Meu Perfil</h1>
        <Card className="animate-fade-in">
          <CardHeader className="items-center">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
              <AvatarImage src={form.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground font-display text-2xl">
                {(form.display_name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 font-display">{form.display_name || 'Usuário'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Conte sobre você..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Cidade, Estado" />
            </div>
            <div className="space-y-2">
              <Label>URL do Avatar</Label>
              <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Habilidades (separadas por vírgula)</Label>
              <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Design, Marketing" />
            </div>
            <Button onClick={handleSave} variant="hero" className="w-full" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
