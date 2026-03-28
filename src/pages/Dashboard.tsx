import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [stats, setStats] = useState({ projects: 0, courses: 0, posts: 0 });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      setProfile(p);

      const [proj, crs, pst] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('courses').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      setStats({ projects: proj.count || 0, courses: crs.count || 0, posts: pst.count || 0 });
    };
    load();
  }, [user]);

  if (!user) return null;

  const statCards = [
    { icon: Briefcase, label: 'Projetos', value: stats.projects, to: '/projects', color: 'text-primary' },
    { icon: BookOpen, label: 'Cursos', value: stats.courses, to: '/courses', color: 'text-secondary' },
    { icon: MessageSquare, label: 'Posts', value: stats.posts, to: '/feed', color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-10 animate-fade-in">
          <h1 className="font-display text-3xl font-bold mb-2">
            Olá, <span className="text-gradient">{profile?.display_name || 'Usuário'}</span> 👋
          </h1>
          <p className="text-muted-foreground">Gerencie seus projetos, cursos e publicações.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold">{s.value}</p>
                <Link to={s.to}>
                  <Button variant="link" size="sm" className="px-0 mt-1">
                    Ver todos <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/profile"><Button variant="outline">Editar Perfil</Button></Link>
          <Link to="/projects"><Button variant="forest">Criar Projeto</Button></Link>
          <Link to="/feed"><Button variant="hero">Publicar no Feed</Button></Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
