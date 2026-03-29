import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Briefcase, Building2, Heart, TreePine, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ProfileType = Database['public']['Enums']['profile_type'];

const profileOptions: { type: ProfileType; label: string; description: string; icon: React.ElementType }[] = [
  { type: 'freelancer', label: 'Freelancer', description: 'Candidate-se a vagas de freela e mostre seu portfólio', icon: Briefcase },
  { type: 'empregador', label: 'Empregador / Projeto Social', description: 'Crie vagas de freela e encontre talentos', icon: Building2 },
  { type: 'voluntario', label: 'Voluntário', description: 'Candidate-se a projetos de voluntariado e impacto social', icon: Heart },
  { type: 'ong', label: 'ONG / Projeto', description: 'Cadastre projetos de permacultura, agrofloresta, cultura', icon: TreePine },
];

const Onboarding = () => {
  const { user, profileType, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState<ProfileType | null>(null);

  // Freelancer
  const [skills, setSkills] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [languages, setLanguages] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  // Empregador
  const [projectDescription, setProjectDescription] = useState('');
  const [vacancies, setVacancies] = useState('');

  // Voluntário
  const [areasOfInterest, setAreasOfInterest] = useState('');
  const [availability, setAvailability] = useState('');
  const [motivation, setMotivation] = useState('');

  // ONG
  const [orgName, setOrgName] = useState('');
  const [mission, setMission] = useState('');
  const [impact, setImpact] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (!authLoading && user && profileType) navigate(getRedirectPath());
  }, [authLoading, user, profileType, navigate, getRedirectPath]);

  const handleSubmit = async () => {
    if (!selectedType || !user) return;
    setLoading(true);
    try {
      await supabase.from('profiles').update({
        profile_type: selectedType,
        location: location || null,
        languages: languages ? languages.split(',').map(l => l.trim()).filter(Boolean) : null,
        skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : null,
      }).eq('user_id', user.id);

      if (selectedType === 'freelancer') {
        await supabase.from('freelancers').insert({
          user_id: user.id,
          portfolio_url: portfolioUrl || null,
          hourly_rate: hourlyRate ? Number(hourlyRate) : null,
          experience_years: experienceYears ? Number(experienceYears) : null,
        });
      } else if (selectedType === 'empregador') {
        await supabase.from('profiles').update({ bio: projectDescription || null }).eq('user_id', user.id);
      } else if (selectedType === 'voluntario') {
        await supabase.from('volunteers').insert({
          user_id: user.id,
          areas_of_interest: areasOfInterest ? areasOfInterest.split(',').map(a => a.trim()).filter(Boolean) : null,
          availability: availability || null,
          motivation: motivation || null,
        });
      } else if (selectedType === 'ong') {
        await supabase.from('ongs').insert({
          user_id: user.id,
          org_name: orgName || user.email || 'Organização',
          mission: mission || null,
          impact: impact || null,
          project_category: projectCategory || null,
          website_url: websiteUrl || null,
        });
      }

      toast.success('Perfil completo!');
      const redirectMap: Record<ProfileType, string> = {
        freelancer: '/projects',
        empregador: '/dashboard',
        voluntario: '/projects',
        ong: '/dashboard',
      };
      // Force profile type reload
      window.location.href = redirectMap[selectedType];
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-xl animate-fade-in">
        <CardHeader className="text-center">
          <Link to="/" className="font-display text-2xl font-bold text-gradient mb-2 inline-block">Aratuya</Link>
          <CardTitle className="text-2xl font-display">Complete seu perfil</CardTitle>
          <CardDescription>
            {step === 1 ? 'Escolha seu tipo de perfil' : 'Preencha os detalhes'}
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  s < step ? 'bg-secondary text-secondary-foreground' :
                  s === step ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 2 && <div className={`w-8 h-0.5 ${s < step ? 'bg-secondary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileOptions.map((opt) => {
                  const Icon = opt.icon;
                  const selected = selectedType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      onClick={() => setSelectedType(opt.type)}
                      className={`group p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                        selected ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                        selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-semibold text-sm mb-1">{opt.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
              <Button onClick={() => setStep(2)} variant="hero" className="w-full" disabled={!selectedType}>
                Próximo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Localização</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade, Estado" />
              </div>

              {selectedType === 'freelancer' && (
                <>
                  <div className="space-y-2"><Label>Habilidades (separadas por vírgula)</Label><Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Design, Python" /></div>
                  <div className="space-y-2"><Label>URL do Portfólio</Label><Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://meuportfolio.com" /></div>
                  <div className="space-y-2"><Label>Idiomas (separados por vírgula)</Label><Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Português, Inglês" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Valor/hora (R$)</Label><Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="50" /></div>
                    <div className="space-y-2"><Label>Anos de experiência</Label><Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="3" /></div>
                  </div>
                </>
              )}

              {selectedType === 'empregador' && (
                <>
                  <div className="space-y-2"><Label>Descrição do projeto/empresa</Label><Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Descreva seu projeto..." rows={3} /></div>
                  <div className="space-y-2"><Label>Vagas disponíveis</Label><Input value={vacancies} onChange={(e) => setVacancies(e.target.value)} placeholder="Desenvolvedor Web, Designer" /></div>
                  <div className="space-y-2"><Label>Idiomas</Label><Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Português, Inglês" /></div>
                </>
              )}

              {selectedType === 'voluntario' && (
                <>
                  <div className="space-y-2"><Label>Áreas de interesse</Label><Input value={areasOfInterest} onChange={(e) => setAreasOfInterest(e.target.value)} placeholder="Permacultura, Educação" /></div>
                  <div className="space-y-2"><Label>Disponibilidade</Label><Input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Fins de semana, integral" /></div>
                  <div className="space-y-2"><Label>Motivação</Label><Textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="Por que você quer ser voluntário?" rows={3} /></div>
                  <div className="space-y-2"><Label>Idiomas</Label><Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Português, Inglês" /></div>
                </>
              )}

              {selectedType === 'ong' && (
                <>
                  <div className="space-y-2"><Label>Nome da organização</Label><Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Nome da ONG" /></div>
                  <div className="space-y-2"><Label>Missão</Label><Textarea value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Qual é a missão?" rows={3} /></div>
                  <div className="space-y-2"><Label>Impacto</Label><Textarea value={impact} onChange={(e) => setImpact(e.target.value)} placeholder="Descreva o impacto..." rows={2} /></div>
                  <div className="space-y-2"><Label>Tipo de projeto</Label><Input value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)} placeholder="Permacultura, Cultural" /></div>
                  <div className="space-y-2"><Label>Website</Label><Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://minhaong.org" /></div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <Button onClick={handleSubmit} variant="hero" className="flex-1" disabled={loading}>
                  {loading ? 'Salvando...' : 'Finalizar'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
