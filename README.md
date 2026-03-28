# 🌿 Aratuya MVP

Plataforma comunitária para conectar freelancers, voluntários, ONGs e projetos sociais.

## 🏗️ Arquitetura

```
aratuya/
├── src/                    # Frontend React + Vite + TailwindCSS
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom hooks (auth, etc.)
│   ├── integrations/       # Cliente Supabase / Lovable Cloud
│   └── lib/                # Utilitários e helpers
├── supabase/               # Migrations do Lovable Cloud
└── public/                 # Assets estáticos
```

**Backend:** Lovable Cloud (PostgreSQL + Auth + Edge Functions)

## ⚡ Quick Start

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O projeto usa Lovable Cloud por padrão (variáveis injetadas automaticamente).

Para **self-hosting** ou **desenvolvimento local**, crie `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...sua-anon-key
VITE_APP_ENV=development
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:8080`

### 4. Build para produção

```bash
npm run build
```

Os arquivos ficam em `dist/`.

## 🚀 Deploy

### Lovable (Recomendado)

1. Clique em **Publish** no editor do Lovable
2. O frontend e backend são deployados automaticamente

### Netlify

1. Conecte o repositório GitHub ao Netlify
2. Configure as variáveis de ambiente no painel
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Conecte o repositório no Vercel
2. Framework preset: `Vite`
3. Configure as variáveis de ambiente

## 🗄️ Banco de Dados

### Produção (Lovable Cloud)

O banco PostgreSQL é gerenciado automaticamente pelo Lovable Cloud com RLS em todas as tabelas.

### Desenvolvimento Local

Para testes com PostgreSQL local, veja os arquivos em `aratuya-deploy/`:

```bash
createdb aratuya_dev
psql postgresql://postgres@localhost:5432/aratuya_dev -f db/migrations/001_init.sql
psql postgresql://postgres@localhost:5432/aratuya_dev -f db/seed.sql
```

## 📋 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Sim |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave anon do Supabase | Sim |
| `VITE_APP_ENV` | Ambiente (`development` / `production`) | Não |

## 🧩 Funcionalidades

- ✅ Cadastro avançado com 4 tipos de perfil
- ✅ Autenticação completa
- ✅ Feed social com posts, curtidas e comentários
- ✅ Projetos com filtros (freela/voluntariado)
- ✅ Cursos
- ✅ Dashboard e perfil editável
- ✅ Redirecionamento inteligente por tipo de perfil
- ✅ Design responsivo

## 📦 Stack

- **Frontend:** React 18, Vite, TailwindCSS, TypeScript
- **UI:** shadcn/ui, Lucide Icons
- **Backend:** Lovable Cloud (Supabase)
- **DB:** PostgreSQL com RLS
- **Fonts:** Space Grotesk + DM Sans
