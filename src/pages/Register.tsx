import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Building2, Heart, TreePine, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import SocialLoginButtons from '@/components/SocialLoginButtons';

type ProfileType = Database['public']['Enums']['profile_type'];

const profileOptions: { type: ProfileType; label: string; description: string; icon: React.ElementType }[] = [
  { type: 'freelancer', label: 'Freelancer', description: 'Candidate-se a vagas de freela e mostre seu portfólio', icon: Briefcase },
  { type: 'empregador', label: 'Empregador / Projeto Social', description: 'Crie vagas de freela e encontre talentos', icon: Building2 },
  { type: 'voluntario', label: 'Voluntário', description: 'Candidate-se a projetos de voluntariado e impacto social', icon: Heart },
  { type: 'ong', label: 'ONG / Projeto', description: 'Cadastre projetos de permacultura, agrofloresta, cultura', icon: TreePine },
];

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: basic info
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Step 2: profile type
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null);

  // Step 3: type-specific fields
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

  const canProceedStep1 = email && password.length >= 6 && displayName;
  const canProceedStep2 = selectedType !== null;

  const handleSubmit = async () => {
    if (!selectedType) return;
    setLoading(true);
    try {
      const { user } = await signUp(email, password, displayName);
      if (!user) { toast.error('Erro ao criar conta'); setLoading(false); return; }

      // Update profile with type and common fields
      await supabase.from('profiles').update({
        profile_type: selectedType,
        location: location || null,
        languages: languages ? languages.split(',').map(l => l.trim()).filter(Boolean) : null,
        skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : null,
      }).eq('user_id', user.id);

      // Insert type-specific data
      if (selectedType === 'freelancer') {
        await supabase.from('freelancers').insert({
          user_id: user.id,
          portfolio_url: portfolioUrl || null,
          hourly_rate: hourlyRate ? Number(hourlyRate) : null,
          experience_years: experienceYears ? Number(experienceYears) : null,
        });
      } else if (selectedType === 'empregador') {
        await supabase.from('profiles').update({
          bio: projectDescription || null,
        }).eq('user_id', user.id);
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
          org_name: orgName || displayName,
          mission: mission || null,
          impact: impact || null,
          project_category: projectCategory || null,
          website_url: websiteUrl || null,
        });
      }

      toast.success('Conta criada com sucesso! Verifique seu email.');
      const redirectMap: Record<ProfileType, string> = {
        freelancer: '/projects',
        empregador: '/dashboard',
        voluntario: '/projects',
        ong: '/dashboard',
      };
      navigate(redirectMap[selectedType]);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-xl animate-fade-in">
        <CardHeader className="text-center">
          <Link to="/" className="font-display text-2xl font-bold text-gradient mb-2 inline-block">Aratuya</Link>
          <CardTitle className="text-2xl font-display">Criar Conta</CardTitle>
          <CardDescription>
            {step === 1 && 'Preencha seus dados básicos'}
            {step === 2 && 'Escolha seu tipo de perfil'}
            {step === 3 && 'Complete seu perfil'}
          </CardDescription>
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  s < step ? 'bg-secondary text-secondary-foreground' :
                  s === step ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-secondary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" />
              </div>
              <Button onClick={() => setStep(2)} className="w-full" variant="hero" disabled={!canProceedStep1}>
                Próximo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: Profile Type */}
          {step === 2 && (
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
                        selected
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/40'
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
              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <Button onClick={() => setStep(3)} variant="hero" className="flex-1" disabled={!canProceedStep2}>
                  Próximo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Type-Specific Fields */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Common fields */}
              <div className="space-y-2">
                <Label>Localização</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade, Estado" />
              </div>

              {/* Freelancer Fields */}
              {selectedType === 'freelancer' && (
                <>
                  <div className="space-y-2">
                    <Label>Habilidades (separadas por vírgula)</Label>
                    <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Design, Python" />
                  </div>
                  <div className="space-y-2">
                    <Label>URL do Portfólio</Label>
                    <Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://meuportfolio.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Idiomas (separados por vírgula)</Label>
                    <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Português, Inglês, Espanhol" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Valor/hora (R$)</Label>
                      <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Anos de experiência</Label>
                      <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="3" />
                    </div>
                  </div>
                </>
              )}

              {/* Empregador Fields */}
              {selectedType === 'empregador' && (
                <>
                  <div className="space-y-2">
                    <Label>Descrição do projeto/empresa</Label>
                    <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Descreva seu projeto ou empresa..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vagas disponíveis</Label>
                    <Input value={vacancies} onChange={(e) => setVacancies(e.target.value)} placeholder="Ex: Desenvolvedor Web, Designer UX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Idiomas (separados por vírgula)</Label>
                    <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Português, Inglês" />
                  </div>
                </>
              )}

              {/* Voluntário Fields */}
              {selectedType === 'voluntario' && (
                <>
                  <div className="space-y-2">
                    <Label>Áreas de interesse (separadas por vírgula)</Label>
                    <Input value={areasOfInterest} onChange={(e) => setAreasOfInterest(e.target.value)} placeholder="Permacultura, Educação, Saúde" />
                  </div>
                  <div className="space-y-2">
                    <Label>Disponibilidade</Label>
                    <Input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Fins de semana, integral, meio período" />
                  </div>
                  <div className="space-y-2">
                    <Label>Motivação</Label>
                    <Textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="Por que você quer ser voluntário?" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Idiomas (separados por vírgula)</Label>
                    <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Português, Inglês" />
                  </div>
                </>
              )}

              {/* ONG Fields */}
              {selectedType === 'ong' && (
                <>
                  <div className="space-y-2">
                    <Label>Nome da organização</Label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Nome da ONG ou projeto" />
                  </div>
                  <div className="space-y-2">
                    <Label>Missão</Label>
                    <Textarea value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Qual é a missão da sua organização?" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Impacto</Label>
                    <Textarea value={impact} onChange={(e) => setImpact(e.target.value)} placeholder="Descreva o impacto do seu trabalho..." rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de projeto</Label>
                    <Input value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)} placeholder="Permacultura, Agrofloresta, Cultural, Holístico" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://minhaong.org" />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </Button>
                <Button onClick={handleSubmit} variant="hero" className="flex-1" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar conta'}
                </Button>
              </div>
            </div>
          )}

          <p className="text-sm text-center text-muted-foreground mt-6">
            Já tem conta? <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
