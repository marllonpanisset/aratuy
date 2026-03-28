import Hero from '@/components/Hero';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, Users, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'Projetos & Freelas',
    description: 'Encontre oportunidades de trabalho freelance ou voluntariado que fazem a diferença na comunidade.',
  },
  {
    icon: BookOpen,
    title: 'Cursos & Formação',
    description: 'Aprenda novas habilidades com cursos criados pela comunidade, para a comunidade.',
  },
  {
    icon: Users,
    title: 'Feed Comunitário',
    description: 'Compartilhe ideias, conquistas e conecte-se com pessoas que compartilham seus valores.',
  },
];

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <Hero />

    {/* Features Section */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa em <span className="text-gradient">um só lugar</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A Aratuya reúne projetos, cursos e comunidade para impulsionar talentos e oportunidades.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-8 rounded-2xl bg-card border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Pronto para começar?
        </h2>
        <p className="text-primary-foreground/80 max-w-md mx-auto mb-8">
          Junte-se a uma comunidade que valoriza colaboração, aprendizado e impacto social.
        </p>
        <Link to="/register">
          <Button variant="hero" size="lg" className="text-base px-10 bg-card text-foreground hover:bg-card/90">
            Criar minha conta <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
