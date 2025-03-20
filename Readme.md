# Feature Request Application

A modern, interactive feature request management system built with Next.js 15. Users can submit feature requests, vote on existing features, and track the status of submissions in real-time.

![Feature Request App Screenshot]
[You may want to add a screenshot of your application here]

## Features

- ✨ Submit new feature requests with title and detailed description
- 🗳️ Upvote/downvote feature requests
- 📊 Automatic sorting of requests by vote count
- 🏷️ Status tracking (Submitted, Accepted, Rejected, Delivered)
- 🌓 Dark/Light mode support with system preference detection
- 📱 Fully responsive design
- 🔔 Toast notifications for user feedback
- 🎯 Product-specific feature requests using URL parameters

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** 
  - [Radix UI](https://www.radix-ui.com/) for accessible components
  - Custom shadcn-style components
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Type Safety:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repo-link]
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Submitting a Feature Request

1. Enter a title for your feature request
2. Provide a detailed description
3. Click the "SUBMIT" button

### Voting on Features

- Click the up arrow (⬆️) to upvote
- Click the down arrow (⬇️) to downvote

### URL Parameters

The application accepts the following URL parameters:
- `productId`: Specify which product to show feature requests for
- `productName`: Display the product name in the header

Example:
```
http://localhost:3000?productId=product123&productName=My Product
```

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Main feature request page
│   └── globals.css     # Global styles
├── components/
│   ├── ui/            # Reusable UI components
│   └── theme-provider # Theme management
└── hooks/
    └── use-toast.ts   # Toast notification hook
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [next-themes](https://github.com/pacocoursey/next-themes) for theme management