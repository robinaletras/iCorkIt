# iCorkIt - Digital Community Cork Board Platform

iCorkIt is an innovative digital platform that reimagines the traditional community cork board for the modern age. It combines social sharing, local advertising, and community building in a unique, pin-based system.

## 🎯 Vision

Transform how communities share information by creating a digital space where everyone can advertise, share social content, and provide services - just like the cork boards you'd find in laundromats, stores, and community centers.

## ✨ Key Features

### 🧷 Smart Pinning System
- **Paid Pinning**: Pin content for up to 7 days using Corkits ($1/day)
- **Protected Content**: Pinned posts cannot be moved or covered
- **Queue System**: Reserve pinning spots in advance

### 🌍 Multi-Level Board Structure
- **National Board**: Country-wide announcements and content
- **State Boards**: Regional content and services
- **City Boards**: Local community updates and services
- **Social Boards**: Private boards created by users

### 💰 Corkits Currency
- 1 Corkit = $1 USD
- Up to 30% bonus on bulk purchases ($100+)
- Reusable pins for social board owners (200 free pins)

### 🔒 Content Moderation
- Platform-controlled board structure and rules
- User-generated content with community guidelines
- Safe and respectful environment

### 🚨 Future Features
- Amber Alert system integration
- Enhanced community safety features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iCorkIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── home/             # Homepage components
│   └── ui/               # UI components (Button, Toaster)
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Database**: Prisma (planned)
- **Authentication**: JWT + bcrypt (planned)

## 📱 Core Components

### Homepage Sections
- **Hero Section**: Main messaging and call-to-action
- **Features**: Platform capabilities overview
- **How It Works**: Step-by-step user journey
- **Board Navigation**: Explore different board types

### Navigation
- **Header**: Main navigation and search
- **Mobile Menu**: Responsive mobile navigation
- **Footer**: Links and company information

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture
- Responsive design principles

## 🌟 Roadmap

### Phase 1 (Current)
- ✅ Landing page and navigation
- ✅ Component architecture
- ✅ Responsive design

### Phase 2 (Next)
- [ ] User authentication system
- [ ] Board creation and management
- [ ] Post creation and pinning
- [ ] Basic user profiles

### Phase 3 (Future)
- [ ] Payment integration (Corkits)
- [ ] Advanced pinning system
- [ ] Social features and connections
- [ ] Mobile app development

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Project**: iCorkIt
- **Team**: iCorkIt Development Team
- **Email**: [contact@icorkit.com](mailto:contact@icorkit.com)

## 🙏 Acknowledgments

- Inspired by traditional community cork boards
- Built with modern web technologies
- Designed for community engagement and connection

---

**iCorkIt** - Bringing communities together, one pin at a time. 🧷✨
