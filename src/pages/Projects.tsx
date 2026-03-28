import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Tables<'projects'>[]>([]);
  const [filter, setFilter] = useState<'all' | 'freela' | 'voluntariado'>('all');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', project_type: 'freela' as 'freela' | 'voluntariado', budget: '', location: '', skills_needed: '' });

  const loadProjects = async () => {
    let query = supabase.from('projects').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('project_type', filter);
    if (search) query = query.ilike('title', `%${search}%`);
    const { data } = await query;
    setProjects(data || []);
  };

  useEffect(() => { loadProjects(); }, [filter, search]);

  const handleCreate = async () => {
    if (!user || !form.title.trim()) { toast.error('Título obrigatório'); return; }
    const { error } = await supabase.from('projects').insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      project_type: form.project_type,
      budget: form.budget ? Number(form.budget) : null,
      location: form.location || null,
      skills_needed: form.skills_needed ? form.skills_needed.split(',').map(s => s.trim()) : null,
    });
    if (error) toast.error('Erro ao criar projeto');
    else { toast.success('Projeto criado!'); setOpen(false); setForm({ title: '', description: '', project_type: 'freela', budget: '', location: '', skills_needed: '' }); loadProjects(); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Projetos</h1>
            <p className="text-muted-foreground">Encontre oportunidades de freela e voluntariado</p>
          </div>
          {user && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="hero"><Plus className="h-4 w-4 mr-2" /> Novo Projeto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Criar Projeto</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.project_type} onValueChange={(v) => setForm({ ...form, project_type: v as 'freela' | 'voluntariado' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freela">Freela</SelectItem>
                        <SelectItem value="voluntariado">Voluntariado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Orçamento (R$)</Label><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Local</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label>Skills (vírgula)</Label><Input value={form.skills_needed} onChange={(e) => setForm({ ...form, skills_needed: e.target.value })} /></div>
                  <Button onClick={handleCreate} variant="hero" className="w-full">Criar</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar projetos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2">
            {(['all', 'freela', 'voluntariado'] as const).map((f) => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
                {f === 'all' ? 'Todos' : f === 'freela' ? 'Freela' : 'Voluntariado'}
              </Button>
            ))}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Nenhum projeto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
