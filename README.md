# Meta Point Advisors

Global market insights and investment thought leadership by Maya Joelson. Meta Point Advisors provides differentiated investment insights, cutting through financial complexities and groupthink with a proven track record of staying ahead of market trends.

## About

Meta Point Advisors was founded by Marisa Joelson (known as Maya) after several years at Merrill Lynch in 2017. With two decades of experience advising CEOs, technology executives, hedge fund managers, families, and individuals on their investment decisions, Maya's differentiated ideas have been featured in the Wall Street Journal, Barron's, and at the World Economic Forum.

## Live Site

**Production URL**: https://metapoint.vercel.app

## Features

- **Newsletter**: Subscribe to The Meta Point newsletter for regular market insights and analysis
- **Advisory Services**: Professional investment advisory services for institutional and individual clients
- **Archive**: Access past newsletters and market commentary
- **About**: Learn more about Maya Joelson's background and expertise
- **Contact**: Get in touch for advisory services and inquiries

## Technology Stack

This site is built with modern web technologies:

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing
- **Supabase** - Backend and database
- **Substack Integration** - Newsletter subscription and content delivery

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd <project-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The project uses Supabase for backend services. Environment variables are configured in `.env`:

```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_URL=your-project-url
```

## Deployment

The site is deployed on Vercel with automatic deployments from the main branch.

## Newsletter Integration

The site integrates with Substack for newsletter delivery and subscription management. Subscribe at [metapointadvisors.substack.com](https://metapointadvisors.substack.com).

## Contact

For advisory services or inquiries, visit the [Contact page](https://metapoint.vercel.app/contact) or email info@metapointadvisors.com.

---

© 2024 Meta Point Advisors. All rights reserved.
