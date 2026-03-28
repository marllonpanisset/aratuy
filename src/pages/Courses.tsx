import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const Courses = () => {
  const [courses, setCourses] = useState<Tables<'courses'>[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      let query = supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending: false });
      if (search) query = query.ilike('title', `%${search}%`);
      const { data } = await query;
      setCourses(data || []);
    };
    load();
  }, [search]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Cursos</h1>
          <p className="text-muted-foreground">Aprenda novas habilidades com a comunidade</p>
        </div>
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cursos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        {courses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Nenhum curso publicado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
