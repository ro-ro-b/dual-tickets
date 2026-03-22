# DUAL Tickets Platform

Secure, verifiable event tickets powered by the DUAL network. A standalone Next.js application for tokenized event ticketing.

## Features

- Event discovery and browsing
- Ticket purchasing with blockchain verification
- My Tickets portfolio management
- Marketplace for ticket resale
- QR code scanning for ticket verification
- Admin dashboard for event management
- Real-time status updates via SSE

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ro-ro-b/dual-tickets.git
cd dual-tickets
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Configure your environment variables with your DUAL network credentials

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (main)/              # Main route group with shared layout
│   │   ├── layout.tsx       # Navigation and footer
│   │   ├── page.tsx         # Events listing (homepage)
│   │   ├── admin/           # Admin dashboard
│   │   ├── marketplace/     # Secondary market
│   │   ├── my-tickets/      # User's ticket portfolio
│   │   ├── scan/            # QR code scanner
│   │   └── tickets/
│   │       └── [id]/        # Individual ticket detail
│   ├── api/                 # Next.js API routes
│   │   ├── tickets/         # Ticket operations
│   │   ├── auth/            # Authentication (OTP, login, status)
│   │   ├── wallet/          # Wallet operations
│   │   ├── objects/         # Object metadata
│   │   ├── templates/       # Template management
│   │   ├── transfer/        # Ticket transfers
│   │   ├── mint/            # Minting operations
│   │   ├── qr/              # QR code generation
│   │   └── ...              # Other APIs
│   ├── layout.tsx           # Root layout with HTML shell
│   └── globals.css          # Global styles
├── components/              # React components
├── lib/                     # Utility libraries
│   ├── dual-sdk.ts          # DUAL SDK wrapper
│   ├── dual-auth.ts         # Authentication helpers
│   ├── dual-client.ts       # DUAL network client
│   ├── data-provider.ts     # Data fetching layer
│   └── ...                  # Other utilities
└── types/                   # TypeScript type definitions
    └── dual.ts              # DUAL-specific types

```

## Environment Variables

See `.env.example` for a complete list. Key variables:

- `NEXT_PUBLIC_DUAL_API_URL`: DUAL network gateway URL
- `DUAL_API_TOKEN`: Authentication token for DUAL APIs
- `DUAL_API_KEY`: API key for DUAL services
- `DUAL_ORG_ID`: Organization ID
- `DUAL_TICKETS_TEMPLATE_ID`: Template ID for minting tickets
- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `NEXT_PUBLIC_API_URL`: Backend API endpoint

## API Endpoints

### Tickets
- `GET /api/tickets` — List all tickets
- `GET /api/tickets/[ticketId]` — Get ticket details
- `POST /api/tickets` — Mint a new ticket
- `POST /api/tickets/[ticketId]/buy` — Purchase a ticket
- `POST /api/tickets/[ticketId]/transfer` — Transfer ticket
- `POST /api/tickets/[ticketId]/verify` — Verify ticket authenticity

### Authentication
- `POST /api/auth/otp` — Request OTP
- `POST /api/auth/login` — Login with OTP
- `GET /api/auth/status` — Check auth status

### Wallet & Portfolio
- `GET /api/wallet` — Get wallet info
- `POST /api/wallet/claim` — Claim rewards

### Other
- `GET /api/stats` — Platform statistics
- `GET /api/sse` — Server-sent events for live updates
- `GET /api/qr/[objectId]` — Generate QR code

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Code**: html5-qrcode, qrcode
- **AI**: Google Gemini API
- **Network**: DUAL Protocol

## License

Proprietary - DUAL Tickets Platform
