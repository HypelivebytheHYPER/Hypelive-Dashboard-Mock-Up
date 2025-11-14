# Hypelive Dashboard - KOL Campaign Management Platform

A comprehensive dashboard for managing KOL (Key Opinion Leader) campaigns, content creation, and analytics. Built with Next.js 16.0.3, React 19.2.0, TypeScript, and modern UI components.

## 📖 Documentation

**Complete documentation is now available in [docs/README.md](docs/README.md)**

- [Architecture](docs/architecture/) - System design and structure
- [Deployment](docs/deployment/) - Deployment guides and strategies
- [Development](docs/development/) - API guides and code standards
- [Design System](docs/design-system/) - HypeUI design system documentation
- [Optimization](docs/optimization/) - Performance optimization guides
- [Quality & Audits](docs/quality/) - Code quality audits and action plans

## 🚀 Features

### Dashboard Overview
- **Real-time Metrics**: Live campaign performance, engagement rates, and ROI tracking
- **Interactive Charts**: Visual analytics with Recharts for trend analysis
- **Platform Performance**: Cross-platform campaign comparison (Instagram, TikTok, LINE, Blog)
- **Recent Activity**: Real-time updates on campaign activities and KOL interactions
- **Vercel Analytics**: Real-time performance monitoring and user interaction tracking
- **Speed Insights**: Core Web Vitals monitoring for optimal user experience

### Campaign Management
- **Campaign Creation**: Intuitive workflow for setting up new campaigns
- **Workflow Builder**: Visual campaign workflow designer with drag-and-drop functionality
- **Performance Tracking**: Real-time campaign metrics and KPI monitoring
- **ROI Calculator**: Automated return on investment calculations
- **Template System**: Reusable campaign templates for common scenarios

### KOL Management
- **KOL Database**: Comprehensive influencer database with detailed profiles
- **Communication Hub**: Centralized messaging system for KOL outreach
- **Contract Management**: Automated contract workflows and negotiations
- **Performance Analytics**: Individual KOL performance tracking and insights

### Content Management
- **Content Calendar**: Visual content scheduling and management
- **Approval Workflows**: Multi-stage content approval process
- **Asset Library**: Centralized storage for campaign assets
- **Performance Analytics**: Content performance tracking across platforms

### Analytics & Reporting
- **Custom Reports**: Flexible reporting with export capabilities
- **Predictive Analytics**: AI-powered performance predictions
- **Benchmarking**: Industry comparison and competitive analysis
- **Attribution Tracking**: Multi-touch attribution for campaign effectiveness
- **Real-time Monitoring**: Vercel Analytics integration for production insights
- **Performance Tracking**: Speed Insights for Core Web Vitals optimization

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 16.0.3 with App Router
- **React**: React 19.2.0 with Server Components
- **Language**: TypeScript 5.7.2 with strict configuration
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 3.4.16 with HypeUI design system
- **Typography**: Bricolage Grotesque + DM Sans
- **Colors**: Nord-inspired palette with frost teal accent
- **Animation**: Framer Motion 11.15.0
- **Charts**: Recharts for data visualization
- **State Management**: Zustand for complex state
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Vercel Analytics 1.5.0 + Speed Insights 1.2.0
- **Caching**: Cache Components (Next.js 16) - Automatic intelligent caching
- **Optimization**: Dynamic imports, React Compiler, Turbopack

### Backend Services
- **API Layer**: RESTful API with Cloudflare Workers integration
- **Authentication**: JWT-based authentication with role-based access
- **Caching**: Redis-based caching with tag invalidation
- **Logging**: Structured logging with performance monitoring
- **Error Handling**: Comprehensive error handling and recovery

### Data Layer
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Cloudflare R2 for asset management
- **Analytics**: Real-time analytics with data aggregation
- **Search**: Full-text search capabilities

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 16.0.3**: React framework with App Router and React Server Components
- **React 19.2.0**: Latest React with enhanced server components
- **TypeScript 5.7.2**: Type-safe development with strict mode
- **Tailwind CSS 3.4.16**: Utility-first CSS framework
- **Radix UI**: Headless accessible UI components
- **Framer Motion 11.15.0**: Advanced animation library
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Zustand**: State management
- **Vercel Analytics 1.5.0**: Real-time analytics and monitoring
- **Speed Insights 1.2.0**: Core Web Vitals tracking
- **Cache Components (Next.js 16)**: Automatic intelligent caching replacing manual ISR configuration

### Data Visualization
- **Recharts**: Chart library for React
- **D3.js**: Custom data visualizations
- **Chart.js**: Alternative charting solution

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **TypeScript**: Type checking

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0 or pnpm >= 8.0.0

### Setup
```bash
# Clone the repository
git clone https://github.com/your-org/hypelive-dashboard.git
cd hypelive-dashboard

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Environment Variables
Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
API_SECRET_KEY=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hypelive

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
R2_BUCKET_NAME=your-bucket-name

# Authentication
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# External Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_CLOUD_KEY=your-google-cloud-key
```

## 🚀 Development

### Available Scripts
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript check

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

### Project Structure
```
hypelive-dashboard/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── campaign/         # Campaign components
├── lib/                   # Utility libraries
│   ├── api/              # API client and services
│   ├── types/            # TypeScript type definitions
│   └── core/             # Core utilities
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
└── public/                # Static assets
```

## 🔧 Configuration

### API Configuration
The application uses a centralized API client with:
- Automatic retry logic with exponential backoff
- Rate limiting protection
- Request/response caching
- Error handling and recovery

### Database Configuration
- PostgreSQL with Prisma ORM
- Database migrations for schema management
- Connection pooling for performance
- Backup and recovery procedures

### Authentication Configuration
- JWT-based authentication
- Role-based access control
- Session management
- Password hashing with bcrypt

## 📊 Analytics Integration

### Supported Platforms
- **Instagram**: Business API integration
- **TikTok**: Business API integration
- **LINE**: Business Connect API
- **Facebook**: Graph API integration
- **YouTube**: Data API integration

### Metrics Tracked
- Campaign reach and impressions
- Engagement rates and interactions
- Conversion tracking
- ROI calculations
- Audience demographics
- Content performance

## 🔒 Security

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF token validation
- Rate limiting

### Privacy Compliance
- GDPR compliance features
- Data anonymization
- Consent management
- Data retention policies
- Right to deletion

## 🧪 Testing

### Unit Tests
- Component testing with Jest
- API endpoint testing
- Utility function testing
- Hook testing

### Integration Tests
- API integration testing
- Database integration testing
- External service mocking
- End-to-end testing

### Performance Testing
- Load testing capabilities
- Performance monitoring
- Memory usage optimization
- Bundle size analysis

## 🚀 Deployment

### Production Build
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Setup
- Production environment configuration
- SSL/TLS certificate setup
- Domain configuration
- CDN setup for static assets

### Monitoring
- Application performance monitoring
- Error tracking and reporting
- Health check endpoints
- Log aggregation

## 📚 Complete Documentation

All documentation has been organized into the `/docs` directory. See [docs/README.md](docs/README.md) for the complete documentation index.

### Key Documents
- **[Architecture Overview](docs/architecture/2025-architecture.md)** - Modern React Server Components architecture
- **[API Client Migration](docs/development/api/api-client-migration.md)** - API client refactoring guide
- **[Deployment Guide](docs/deployment/deployment-guide-2025.md)** - Comprehensive deployment instructions
- **[HypeUI Design System](docs/design-system/hypeui/)** - Complete design system documentation
  - Phase 1: Typography & Colors (Grade: B+ 85/100)
  - Phase 2: Visual Polish & Motion (Grade: A- 92/100)
- **[Code Quality Audit](docs/quality/comprehensive-audit.md)** - Latest codebase audit (A+ 95/100)
- **[Action Plan](docs/quality/audit-action-plan.md)** - Pending improvements and fixes

### Documentation Structure
```
docs/
├── architecture/     # System design and structure
├── deployment/      # Deployment guides and strategies
├── development/     # API guides and code standards
├── design-system/   # HypeUI design system
├── optimization/    # Performance optimization
├── quality/         # Code quality and audits
└── archive/         # Historical documents
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use consistent code formatting
- Write comprehensive tests
- Document your code
- Follow accessibility guidelines

### Review Process
- Code review by maintainers
- Automated testing validation
- Performance impact assessment
- Security review

## 🆘 Support

### Getting Help
- Check the documentation
- Search existing issues
- Create a new issue
- Contact support team

### Reporting Issues
- Use the issue tracker
- Provide detailed descriptions
- Include reproduction steps
- Add relevant screenshots

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- shadcn/ui for the beautiful components
- Radix UI for the headless components
- The open-source community for various libraries and tools

## 📞 Contact

For questions, support, or collaboration opportunities:
- Email: support@hypelive.com
- Website: https://hypelive.com
- Documentation: https://docs.hypelive.com

---

**Built with ❤️ by the Hypelive Team**