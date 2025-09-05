# WEB.BUILDING.GENIOUS 🤖

AI-Powered Web Application Generator with Multi-Provider Support

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web-building-genious)
[![Deploy to HuggingFace Spaces](https://huggingface.co/datasets/huggingface/badges/resolve/main/deploy-to-spaces-md.svg)](https://huggingface.co/spaces/yourusername/web-building-genious)

## Features

- 🤖 **Multi-AI Provider Support** - OpenAI, OpenRouter, GROQ, XAI with intelligent fallback
- 💬 **Chat Interface with Memory** - Persistent conversation history
- 👀 **Live Code Preview** - Real-time HTML/CSS/JS preview
- 📁 **Project Management** - Save, load, and organize your projects
- ⬆️ **File Upload/Download** - Import/export projects and chat history
- 🔐 **User Authentication** - Secure login with Supabase
- 🎨 **Modern UI** - Clean, responsive design with dark/light themes

## Quick Start

### 1. Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web-building-genious)

1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables (see below)
4. Deploy!

### 2. Deploy to HuggingFace Spaces

[![Deploy to HuggingFace Spaces](https://huggingface.co/datasets/huggingface/badges/resolve/main/deploy-to-spaces-md.svg)](https://huggingface.co/spaces/yourusername/web-building-genious)

1. Click the deploy button above
2. Fork the repository to your HuggingFace account
3. Configure secrets in Space settings
4. The app will auto-deploy!

### 3. Local Development

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/web-building-genious.git
cd web-building-genious

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
\`\`\`

## Environment Variables

### Required Variables

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Provider Keys (at least one required)
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
GROQ_API_KEY=your_groq_api_key
XAI_API_KEY=your_xai_api_key
\`\`\`

### Optional Variables

\`\`\`env
# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
\`\`\`

## Database Setup

The application uses Supabase for data persistence. Run the included migration scripts:

\`\`\`sql
-- Run these in your Supabase SQL editor or via the API
-- 1. scripts/001_create_projects_table.sql
-- 2. scripts/002_create_user_profiles.sql  
-- 3. scripts/003_enhance_chat_messages.sql
\`\`\`

## AI Provider Configuration

The app supports multiple AI providers with automatic fallback:

1. **OpenAI** (Primary) - GPT-4o for best quality
2. **OpenRouter** (Fallback 1) - Access to multiple models
3. **GROQ** (Fallback 2) - Fast inference with Llama
4. **XAI** (Fallback 3) - Grok models

Configure at least one provider. The system will automatically use the first available provider based on your API keys.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Main application
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── ai/               # AI provider logic
│   ├── database/         # Database operations
│   └── supabase/         # Supabase client setup
├── scripts/              # Database migration scripts
└── public/               # Static assets
\`\`\`

## API Endpoints

- `POST /api/chat` - Generate AI responses
- `GET /api/chat?userId=...` - Get chat history
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@webbuilding.genious
- 💬 Discord: [Join our community](https://discord.gg/webbuilding)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/web-building-genious/issues)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Vercel AI SDK](https://sdk.vercel.ai/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Vercel](https://vercel.com/) and [HuggingFace Spaces](https://huggingface.co/spaces)
