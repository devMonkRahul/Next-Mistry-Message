# Mistry Message

A modern Next.js application that allows users to send and receive anonymous messages with AI-powered suggestions.

## Features

- **User Authentication**: Secure signup and signin with email verification
- **Anonymous Messaging**: Send anonymous messages to registered users
- **Message Management**: View, accept, and delete received messages
- **AI-Powered Suggestions**: Get message suggestions using Google's AI models
- **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Validation**: Zod, React Hook Form
- **Email**: Nodemailer, Resend, React Email
- **AI**: AI SDK with Google integration
- **Styling**: Tailwind CSS, Radix UI components
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database
- Google AI API key (for message suggestions)
- Email service credentials (for verification emails)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/devMonkRahul/Next-Mistry-Message.git
   cd Next-Mistry-Message
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Email (Choose one: Nodemailer or Resend)
   # For Nodemailer
   EMAIL_SERVER_USER=your_email
   EMAIL_SERVER_PASSWORD=your_email_password
   EMAIL_SERVER_HOST=smtp.example.com
   EMAIL_SERVER_PORT=587
   EMAIL_FROM=your_email

   # For Resend
   RESEND_API_KEY=your_resend_api_key

   # Google AI
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                   # Next.js App Router
│   ├── (app)/             # Main application routes
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   └── u/                 # User profile routes
├── components/            # React components
│   └── ui/                # UI components
├── config/                # Configuration files
├── context/               # React context providers
├── lib/                   # Utility libraries
├── model/                 # MongoDB models
├── schemas/               # Zod validation schemas
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)