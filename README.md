# ReWear Frontend - Modern Sustainable Fashion Platform

A cutting-edge React/Next.js frontend for the ReWear sustainable fashion platform. Built with modern web technologies to deliver a seamless, responsive, and engaging user experience for clothing swaps and community building.

## 🎯 Frontend Mission

**ReWear Frontend** delivers an intuitive and beautiful user interface that makes sustainable fashion accessible to everyone. Our frontend focuses on:

- **Seamless User Experience**: Intuitive navigation and smooth interactions
- **Responsive Design**: Perfect experience across all devices and screen sizes
- **Real-time Features**: Live and instant email updates
- **Performance Optimization**: Fast loading and smooth animations
- **Accessibility**: Inclusive design for all users
- **Modern UI/UX**: Beautiful, sustainable-themed interface

### Key Frontend Features
- **Interactive Landing Page**: Engaging hero section with animated showcases
- **Smart Item Discovery**: Advanced search and filtering capabilities
- **Real-time Swap Management**: Live updates for swap requests and status changes
- **Points System UI**: Visual point tracking and transaction history
- **Admin Dashboard**: Comprehensive moderation and analytics interface
- **Mobile-First Design**: Optimized for mobile and tablet users

## 👥 Team Members

- **Mohammed Huzaifa** - huzaifa.coder785@gmail.com
- **Omar Nahdi** - omarnahdi2021@gmail.com  
- **Shaikh Rayyan** - shaikhrayyanofficial@gmail.com

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rewear-frontend.git
   cd rewear-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit with your backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗️ Frontend Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 15 | React framework with SSR/SSG capabilities |
| **UI Library** | React 18 | Component-based UI development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Animations** | Framer Motion | Smooth animations and transitions |
| **Icons** | Lucide React | Beautiful, customizable icons |
| **State Management** | React Context | Global state management |
| **HTTP Client** | Fetch API | RESTful API communication |
| **Development** | ESLint | Code quality and consistency |

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   ├── items/             # Item management
│   │   ├── [id]/          # Item detail pages
│   │   └── create/        # Create new item
│   ├── profile/           # User profile
│   ├── search/            # Search functionality
│   ├── swaps/             # Swap management
│   │   └── [id]/          # Swap detail pages
│   ├── globals.css        # Global styles
│   ├── layout.jsx         # Root layout
│   └── page.js            # Landing page
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── context/               # React Context providers
├── services/              # API and utility services
└── styles/                # Additional stylesheets
```

### Key Components

#### Layout Components
- **Layout.jsx**: Main application wrapper with navigation
- **Navbar.jsx**: Responsive navigation with user menu
- **Sidebar.jsx**: Collapsible sidebar for mobile navigation
- **QuickActions.jsx**: Floating action buttons

#### UI Components
- **Button.jsx**: Reusable button with multiple variants
- **Card.jsx**: Content containers with hover effects
- **Input.jsx**: Form inputs with validation states
- **Badge.jsx**: Status indicators and point displays

#### Authentication Components
- **LoginForm.jsx**: User login with validation
- **RegisterForm.jsx**: User registration with profile setup

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--green-50: #f0fdf4
--green-100: #dcfce7
--green-600: #16a34a
--green-700: #15803d

/* Neutral Colors */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-600: #4b5563
--gray-900: #111827
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Responsive**: Fluid typography scaling

### Component Variants
```jsx
// Button variants
<Button variant="sustainable">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>

// Card variants
<Card className="card-hover">Interactive Card</Card>
<Card className="card-elevated">Elevated Card</Card>
```

## 🔧 Development Features

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (integrated)
- **TypeScript Ready**: Type-safe development support

### Performance Optimizations
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component and image lazy loading
- **Caching**: Strategic caching strategies

### Development Tools
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Environment
NEXT_PUBLIC_API_URL  # Backend API URL
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Mobile Optimizations
- **Touch-friendly**: Large touch targets
- **Swipe gestures**: Intuitive navigation
- **Offline support**: Service worker ready
- **Fast loading**: Optimized for slow connections

## 🔌 API Integration

### Service Layer
The frontend communicates with the backend through a comprehensive service layer:

```javascript
// Authentication
import { loginUser, registerUser, getCurrentUser } from '../services/api_calls';

// Items
import { listItems, createItem, getItem } from '../services/api_calls';

// Swaps
import { createSwapRequest, acceptSwap, rejectSwap } from '../services/api_calls';
```

### Real-time Features
- **WebSocket Integration**: Live notifications and updates
- **Auto-refresh**: Automatic data synchronization
- **Optimistic Updates**: Immediate UI feedback

## 🎯 Key Pages & Features

### Landing Page (`/`)
- **Hero Section**: Animated showcase with rotating images
- **Features Grid**: Platform benefits and capabilities
- **How It Works**: 4-step process explanation
- **Call-to-Action**: User registration prompts

### Item Management (`/items`)
- **Item Grid**: Responsive card layout
- **Advanced Filters**: Category, size, condition, price
- **Search**: Real-time search with suggestions
- **Item Details**: Comprehensive item information

### Swap System (`/swaps`)
- **Swap Requests**: Incoming and outgoing requests
- **Status Tracking**: Visual status indicators
- **Communication**: Built-in messaging system
- **Completion Flow**: Step-by-step swap completion

### User Dashboard (`/dashboard`)
- **Overview**: User statistics and recent activity
- **Points Balance**: Current points and transaction history
- **Quick Actions**: Common user actions
- **Notifications**: Real-time updates

### Admin Panel (`/admin`)
- **User Management**: User moderation and status control
- **Content Moderation**: Item approval and rejection
- **Analytics**: Platform statistics and insights
- **System Management**: Category and platform settings

## 🧪 Testing Strategy

### Component Testing
```bash
# Unit tests for components
npm run test:components

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Performance Testing
- **Lighthouse**: Core Web Vitals optimization
- **Bundle Analysis**: Code splitting verification
- **Load Testing**: API endpoint performance

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables
vercel env add NEXT_PUBLIC_API_URL
```

### Other Platforms
- **Netlify**: Static site deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

### Environment Configuration
```bash
# Production
NEXT_PUBLIC_API_URL=https://api.rewear.com
NEXT_PUBLIC_ENVIRONMENT=production

# Staging
NEXT_PUBLIC_API_URL=https://staging-api.rewear.com
NEXT_PUBLIC_ENVIRONMENT=staging
```

## 🔒 Security Features

### Frontend Security
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token-based request validation
- **Input Sanitization**: Client-side validation
- **Secure Storage**: Token management best practices

### Authentication Flow
1. **Login**: Secure token-based authentication
2. **Token Refresh**: Automatic token renewal
3. **Logout**: Secure session termination
4. **Route Protection**: Authenticated route guards

## 📊 Analytics & Monitoring

### User Analytics
- **Page Views**: User navigation tracking
- **User Engagement**: Time on site and interactions
- **Conversion Tracking**: Registration and swap completion
- **Performance Metrics**: Core Web Vitals monitoring

### Error Tracking
- **Error Boundaries**: Graceful error handling
- **Error Logging**: Comprehensive error reporting
- **Performance Monitoring**: Real-time performance tracking

## 🌱 Sustainability Features

### Frontend Sustainability
- **Optimized Assets**: Compressed images and fonts
- **Efficient Code**: Minimal bundle sizes
- **Green Hosting**: Environmentally conscious hosting
- **Accessibility**: Inclusive design for all users

### User Experience
- **Dark Mode Ready**: Energy-saving display options
- **Offline Capabilities**: Reduced server requests
- **Progressive Enhancement**: Works without JavaScript
- **Performance First**: Fast loading for all users

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Develop** with best practices
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards
- **ESLint**: Follow linting rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages
- **Component Documentation**: JSDoc comments

## 📄 License

This project is licensed under the MIT License - promoting open-source sustainability solutions.

## 🙏 Acknowledgments

Built with modern web technologies to create a sustainable future through accessible, beautiful, and performant user interfaces. Every pixel counts in our mission for sustainable fashion! 🌱

---

*Odoo Hackathon Project - Building a more sustainable future through technology*
