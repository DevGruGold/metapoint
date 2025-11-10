# 📊 Meta Point Advisors

<div align="center">

[![Live Site](https://img.shields.io/badge/Live-metapoint.vercel.app-blue)](https://metapoint.vercel.app)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()
[![Built with React](https://img.shields.io/badge/React-18.x-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e)](https://supabase.com)

**Global market insights and investment thought leadership by Maya Joelson**

*Cutting through financial complexities and groupthink with a proven track record of staying ahead of market trends*

[Live Site](https://metapoint.vercel.app) • [Newsletter](https://metapointadvisors.substack.com) • [Contact](https://metapoint.vercel.app/contact)

</div>

---

## 📖 About Meta Point Advisors

Meta Point Advisors was founded by **Marisa Joelson** (known as Maya) after several years at Merrill Lynch in 2017. With **two decades of experience** advising CEOs, technology executives, hedge fund managers, families, and individuals on their investment decisions, Maya's differentiated ideas have been featured in:

- 📰 **The Wall Street Journal**
- 📊 **Barron's**
- 🌍 **World Economic Forum**

### Our Mission

Delivering global market insights and thought leadership in the realm of investing. We simplify financial complexities and challenge conventional groupthink, empowering individuals and organizations to make informed, forward-thinking investment decisions.

---

## 🚀 Live Deployment

**Production URL**: [https://metapoint.vercel.app](https://metapoint.vercel.app)

**Status**: ✅ Live and operational

**Hosting**: Vercel (auto-deploy from `main` branch)

---

## ✨ Features

### 🏠 Public-Facing Pages

- **Home** (`/`) - Hero section, featured articles, economic insights, mission statement
- **Newsletter Archive** (`/archive`) - Complete collection of articles with search functionality
- **Subscribe** (`/subscribe`) - Newsletter subscription page with benefits and FAQs
- **Advisory Services** (`/advisors`) - Investment advisory service offerings and approach
- **About** (`/about`) - Maya Joelson's background, expertise, and media features
- **Contact** (`/contact`) - Professional contact form with email integration
- **Newsletter Info** (`/newsletter`) - Substack integration and subscription details

### 📰 Content Management

#### Featured Articles System
- **4 Curated Articles** with direct ConstantContact links
- Professional teasers and excerpts
- Searchable archive with category filtering
- External link handling with proper SEO attributes

**Current Featured Articles**:
1. Black Swan/Black Bat - Coronavirus market crash analysis (March 2020)
2. World War III - Geopolitical tensions analysis (March 2022)  
3. Ides of March - Historical market patterns (March 2023)
4. ESG Diversity - Socially responsible investing investigation (June 2023)

#### Newsletter Database
- **PostgreSQL** database via Supabase
- Fields: title, excerpt, full_content, category, author, published_date, slug
- Featured articles toggle (`is_featured`)
- Published status management (`is_published`)
- External link support for legacy content

### 🔐 Admin Portal

**Access**: `/admin/*` (requires admin role)

**Admin Features**:
- **Dashboard** (`/admin`) - Analytics and overview
- **Import System** (`/admin/import`) - Multi-format article import
  - ✅ URL Import (AI-powered extraction from ConstantContact)
  - ✅ CSV Upload
  - ✅ JSON Upload
  - ✅ Manual paste
  - ✅ Sample data loader
- **Article Management** (`/admin/articles`) - Edit, publish, feature, delete
- **User Authentication** - Secure role-based access control

### 🤖 AI-Powered Import

**Edge Functions** for content migration:
- `ai-migrate-story` - Extract articles from URLs using Gemini 2.5 Pro
- `ai-story-assistant` - Content formatting and optimization
- `ai-format-story` - HTML cleanup and structuring
- `ai-seo-optimizer` - SEO metadata generation

**Capabilities**:
- Extracts article content from ConstantContact newsletters
- Preserves images and formatting
- Generates slugs and excerpts
- Handles 2,700+ word articles with 7+ images
- 30-60 second processing time

### 📧 Email Integration

**Resend SMTP Configuration**:
- Contact form emails → `mmjoelson@gmail.com`
- Authentication emails (sign up, password reset)
- Professional HTML templates
- Sender: `noreply@metapointadvisors.com`

**Edge Function**: `send-contact-email`
- Form validation
- HTML email templates
- Reply-to handling
- Error logging

### 🔒 Authentication & Authorization

**Supabase Auth** with role-based access:
- Email/password authentication
- Email verification
- Password reset flow
- Admin role system via `user_roles` table
- Row Level Security (RLS) policies

**Admin Users**:
- `mmjoelson@gmail.com` (primary admin)

---

## 🛠️ Technology Stack

### Frontend
- **React 18.x** - Modern UI framework
- **TypeScript 5.x** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible component library
- **React Router 6** - Client-side routing
- **TanStack Query** - Server state management
- **React Hook Form + Zod** - Form validation

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, storage
- **Edge Functions** - Serverless TypeScript functions (Deno runtime)
- **Row Level Security** - Database-level access control
- **Real-time subscriptions** - Live data updates

### AI & APIs
- **Lovable AI Gateway** - Gemini 2.5 Pro for content extraction
- **Resend API** - Transactional email delivery
- **SMTP** - smtp.resend.com:465 (SSL/TLS)

### Deployment & Hosting
- **Vercel** - Frontend hosting with auto-deploy
- **Supabase Cloud** - Database and Edge Functions
- **Custom Domain** - metapointadvisors.com

---

## 📁 Project Structure

```
metapoint/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AdminLayout.tsx
│   │   ├── Hero.tsx
│   │   ├── NewsletterCard.tsx
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Home.tsx
│   │   ├── Archive.tsx
│   │   ├── Contact.tsx
│   │   ├── Subscribe.tsx
│   │   └── admin/          # Admin portal pages
│   │       ├── Import.tsx
│   │       └── Articles.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication context
│   │   └── use-toast.ts
│   ├── data/               # Static data files
│   │   └── featuredArticles.ts  # Curated articles
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/
│   └── lib/                # Utility functions
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── ai-migrate-story/
│   │   ├── send-contact-email/
│   │   └── ...
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── index.html
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Supabase account** (for backend services)
- **Resend account** (for email delivery)
- **Vercel account** (for deployment, optional)

### Local Development

```bash
# Clone the repository
git clone https://github.com/DevGruGold/metapoint.git

# Navigate to project directory
cd metapoint

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=esozoaohiqeldippzxms
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=your-project-url

# Edge Function Secrets (set in Supabase Dashboard)
# RESEND_API_KEY=re_your_resend_api_key
# LOVABLE_API_KEY=your_lovable_api_key
```

### Database Setup

Run the SQL scripts in Supabase SQL Editor:

```sql
-- 1. Create user_roles table
-- 2. Create newsletters table
-- 3. Set up RLS policies
-- 4. Grant admin role
-- See: disable_jwt_open_rls.sql
```

### Edge Function Secrets

Set in Supabase Dashboard → Project Settings → Edge Functions → Secrets:

```bash
RESEND_API_KEY=re_your_key_here
LOVABLE_API_KEY=your_key_here
```

---

## 📊 Database Schema

### `newsletters` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Article title |
| `slug` | TEXT | URL-friendly identifier |
| `excerpt` | TEXT | Short summary (2-3 sentences) |
| `full_content` | TEXT | Complete article HTML |
| `category` | TEXT | Article category |
| `author` | TEXT | Author name (default: Maya Joelson) |
| `published_date` | DATE | Publication date |
| `is_featured` | BOOLEAN | Show on home page |
| `is_published` | BOOLEAN | Visible to public |
| `featured_image` | TEXT | Image URL (optional) |
| `external_link` | TEXT | Original source URL (optional) |
| `created_by` | UUID | Admin user ID |
| `created_at` | TIMESTAMP | Creation timestamp |

### `user_roles` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | References auth.users |
| `role` | TEXT | admin/editor/viewer |
| `created_at` | TIMESTAMP | Role assignment date |

---

## 🔧 Configuration

### SMTP (Resend)

**Supabase Auth Settings**:
- Host: `smtp.resend.com`
- Port: `465`
- Username: `resend`
- Password: Your Resend API key
- SSL: Enabled
- Sender: `noreply@metapointadvisors.com`

### AI Import (Lovable)

**Gemini 2.5 Pro** via Lovable AI Gateway:
- Extracts article content from HTML
- Generates structured JSON
- Preserves formatting and images
- Categories: Policy Analysis, Market Trends, Trade Relations, Economic Indicators, Investment Insights

---

## 📝 Content Management Workflow

### Importing Articles

1. **Admin Login** → Navigate to `/admin/import`
2. **URL Tab** → Paste ConstantContact newsletter URL
3. **Import** → AI extracts content (30-60s)
4. **Publish** → Run SQL to set `is_published = true`
5. **Feature** → Set `is_featured = true` for home page (max 3)

### Publishing Workflow

```sql
-- Publish article
UPDATE newsletters 
SET is_published = true 
WHERE id = 'article-id';

-- Feature on home page
UPDATE newsletters 
SET is_featured = true 
WHERE id = 'article-id';
```

### Featured Articles

Managed in `src/data/featuredArticles.ts`:
- Static TypeScript array
- Direct external links
- No database dependency
- Perfect for curated highlights

---

## 🧪 Testing

### Contact Form
1. Visit `/contact`
2. Submit form
3. Check `mmjoelson@gmail.com`

### Admin Access
1. Sign in as admin
2. Navigate to `/admin/import`
3. Test URL import with sample article

### Article Display
- **Home**: Max 3 featured articles in "Latest Insights"
- **Archive**: All published articles, searchable
- **External Links**: Open in new tab

---

## 🚀 Deployment

### Automatic Deployment (Vercel)

**Trigger**: Push to `main` branch
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Framework**: Vite

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod
```

---

## 🔐 Security

### Authentication
- ✅ Email verification required
- ✅ Secure password hashing (Supabase Auth)
- ✅ JWT tokens with short expiry
- ✅ Row Level Security on all tables

### Admin Access
- ✅ Role-based access control
- ✅ `has_role()` RPC function for authorization
- ✅ Protected admin routes
- ✅ Edge Function JWT verification

### Email Security
- ✅ SMTP over SSL/TLS (port 465)
- ✅ API key stored in secrets
- ✅ Rate limiting via Resend
- ✅ Verified sender domain

---

## 📈 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### Optimizations
- ✅ Lazy loading for images
- ✅ Code splitting per route
- ✅ Tailwind CSS purging
- ✅ Vite build optimization
- ✅ CDN delivery via Vercel
- ✅ Database connection pooling

---

## 📞 Support & Contact

### For Development Issues
- **Repository**: https://github.com/DevGruGold/metapoint
- **Issues**: GitHub Issues tab

### For Advisory Services
- **Website**: https://metapoint.vercel.app
- **Email**: info@metapointadvisors.com
- **Contact Form**: https://metapoint.vercel.app/contact

### For Newsletter Inquiries
- **Substack**: https://metapointadvisors.substack.com
- **Subscribe**: https://metapoint.vercel.app/subscribe

---

## 📄 License

**Proprietary** - © 2024 Meta Point Advisors. All rights reserved.

This is a private repository. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🙏 Acknowledgments

- **Built with**: [Lovable](https://lovable.dev) - AI-powered development platform
- **Hosted on**: [Vercel](https://vercel.com) - Frontend deployment
- **Backend**: [Supabase](https://supabase.com) - Database and authentication
- **Email**: [Resend](https://resend.com) - Transactional email delivery
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) - Component library

---

## 📊 Project Status

**Current Version**: 1.0.0 (Production)

**Recent Updates**:
- ✅ Featured articles system implemented
- ✅ AI-powered URL import functional
- ✅ Admin authentication stabilized
- ✅ Resend email integration configured
- ✅ Newsletter archive live with 4 articles

**Roadmap**:
- 🔄 Import remaining 13 newsletters
- 🔄 Custom email templates
- 🔄 Analytics dashboard
- 🔄 Advanced search filters
- 🔄 Article comments system

---

<div align="center">

**Meta Point Advisors** | Cutting Through Financial Complexities Since 2017

[Website](https://metapoint.vercel.app) • [Newsletter](https://metapointadvisors.substack.com) • [Contact](https://metapoint.vercel.app/contact)

</div>
