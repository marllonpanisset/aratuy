import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface ProfileCardProps {
  profile: Tables<'profiles'>;
}

const ProfileCard = ({ profile }: ProfileCardProps) => (
  <Card className="text-center">
    <CardContent className="pt-6">
      <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
        <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
        <AvatarFallback className="bg-primary text-primary-foreground font-display text-xl">
          {(profile.display_name || 'U').charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h3 className="font-display font-semibold text-lg">{profile.display_name || 'Usuário'}</h3>
      {profile.location && (
        <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin className="h-3 w-3" /> {profile.location}
        </p>
      )}
      {profile.bio && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{profile.bio}</p>
      )}
      {profile.skills && profile.skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {profile.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="text-xs bg-muted px-2 py-0.5 rounded-full">{skill}</span>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default ProfileCard;
