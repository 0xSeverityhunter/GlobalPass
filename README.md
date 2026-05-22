# 🌍 GlobalPass

**AI-Powered Visa Requirements Checker & Document Scanner**

GlobalPass helps travelers instantly check visa requirements between countries and scan visa documents using AI to extract key information.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

---

## ✨ Features

### 🔍 Visa Requirements Checker
- Select your passport country and destination
- Instant visa requirement results (visa-free, visa required, eTA, etc.)
- Color-coded status cards with detailed information
- Searchable country dropdowns with 200+ countries

### 📷 AI Visa Scanner
- Upload visa document images (JPG, PNG, WebP)
- AI-powered extraction of visa details:
  - Visa type, issuing country, validity dates
  - Entry type (single/multiple), max stay duration
  - Restrictions and special conditions
- **Multi-Provider Failover**: Automatically tries Gemini → GPT-4o → Claude
- Smart comparison: Verify if your visa is valid for a specific destination

### 🎨 Premium Design
- Light/Dark theme toggle
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Interactive mouse-following spotlight effect

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AI API key (at least one of: Gemini, OpenAI, Anthropic)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GlobalPass.git
   cd GlobalPass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Required: At least one AI provider
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: For failover support
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

   **Get API Keys:**
   - Gemini: [Google AI Studio](https://aistudio.google.com/apikey)
   - OpenAI: [OpenAI Platform](https://platform.openai.com/api-keys)
   - Anthropic: [Anthropic Console](https://console.anthropic.com/)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
GlobalPass/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── scan-visa/     # Visa scanning endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── VisaSearch.tsx     # Main search interface
│   ├── VisaUpload.tsx     # Drag & drop upload
│   ├── ScannedVisaCard.tsx# Scan results display
│   ├── ResultDashboard.tsx# Requirements display
│   └── ...
├── lib/                   # Utilities & AI integrations
│   ├── gemini.ts          # Google Gemini integration
│   ├── openai.ts          # OpenAI GPT-4 integration
│   ├── claude.ts          # Anthropic Claude integration
│   ├── ai-types.ts        # Shared AI types
│   ├── comparison.ts      # Visa validation logic
│   └── data.ts            # Country & visa data
└── public/                # Static assets
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI Providers | Google Gemini, OpenAI, Anthropic |
| Theme | next-themes |

---

## 🔐 Power User Features

### Hidden Settings Panel
Press `Ctrl+Shift+P` while in the Scan tab to reveal advanced AI settings:
- Force a specific AI provider
- Override automatic failover

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
Works with any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with `npm run build && npm run start`

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using Next.js and AI**
