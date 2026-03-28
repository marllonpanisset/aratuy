import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface CourseCardProps {
  course: Tables<'courses'>;
}

const CourseCard = ({ course }: CourseCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    {course.thumbnail_url ? (
      <img
        src={course.thumbnail_url}
        alt={course.title}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-40 bg-gradient-to-br from-secondary to-forest flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-secondary-foreground/60" />
      </div>
    )}
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between gap-2">
        <CardTitle className="text-base font-display">{course.title}</CardTitle>
        {course.category && <Badge variant="outline" className="text-xs shrink-0">{course.category}</Badge>}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2">{course.description || 'Sem descrição.'}</p>
    </CardContent>
  </Card>
);

export default CourseCard;
