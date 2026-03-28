import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Tables } from '@/integrations/supabase/types';

interface ProjectCardProps {
  project: Tables<'projects'>;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/60">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2">
        <CardTitle className="text-lg font-display leading-snug">{project.title}</CardTitle>
        <Badge variant={project.project_type === 'freela' ? 'default' : 'secondary'} className="shrink-0">
          {project.project_type === 'freela' ? 'Freela' : 'Voluntariado'}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="pb-3">
      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
        {project.description || 'Sem descrição.'}
      </p>
      {project.skills_needed && project.skills_needed.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.skills_needed.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>
      )}
    </CardContent>
    <CardFooter className="text-xs text-muted-foreground gap-4">
      {project.location && (
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</span>
      )}
      {project.budget && (
        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />R$ {project.budget}</span>
      )}
      <span className="flex items-center gap-1 ml-auto">
        <Calendar className="h-3 w-3" />
        {formatDistanceToNow(new Date(project.created_at), { addSuffix: true, locale: ptBR })}
      </span>
    </CardFooter>
  </Card>
);

export default ProjectCard;
