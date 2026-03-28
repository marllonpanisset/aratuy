import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border bg-card mt-auto">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold text-gradient mb-3">Aratuya</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Conectando comunidades, talentos e oportunidades na Amazônia e além.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Navegação</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/projects" className="hover:text-foreground transition-colors">Projetos</Link>
            <Link to="/courses" className="hover:text-foreground transition-colors">Cursos</Link>
            <Link to="/feed" className="hover:text-foreground transition-colors">Feed</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Conta</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">Entrar</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Cadastrar</Link>
          </nav>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aratuya. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
