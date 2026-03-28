import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => (
  <section className="relative overflow-hidden min-h-[85vh] flex items-center">
    <img
      src={heroBg}
      alt="Comunidade amazônica vista aérea"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
    <div className="relative container mx-auto px-4 py-20">
      <div className="max-w-2xl animate-fade-in">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
          Plataforma comunitária
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-primary-foreground mb-6">
          Conecte-se.<br />
          <span className="text-sun">Colabore.</span><br />
          Transforme.
        </h1>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
          Encontre projetos freelance, voluntariado, cursos e uma comunidade vibrante. A Aratuya conecta talentos a oportunidades que fazem a diferença.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register">
            <Button variant="hero" size="lg" className="text-base px-8">
              Começar agora
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" size="lg" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              Explorar projetos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
