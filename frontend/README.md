# Clipix Frontend - AI Video Editor UI

## Overview

Modern React-based frontend for Clipix AI Video Editor with drag-and-drop video upload, real-time editing, and AI-powered caption generation.

## Features

- **Video Upload**: Drag & drop interface with progress tracking (up to 10GB)
- **Video Library**: Manage and browse uploaded videos
- **Professional Video Player**: HTML5 player with timeline controls
- **Editing Tools**:
  - Trim videos with visual timeline
  - AI caption generation
  - Real-time progress tracking
- **Export Options**: Download edited videos and subtitle files
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **Framework**: React 19
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Build Tool**: Create React App with CRACO

## Prerequisites

- Node.js 18+ (LTS recommended)
- Yarn package manager
- Backend API running

## Installation

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment

Create a `.env` file in the frontend directory:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

**Important**: Update `REACT_APP_BACKEND_URL` to point to your backend API URL.

## Running the App

### Development Mode

```bash
yarn start
```

App will run on `http://localhost:3000`

### Production Build

```bash
yarn build
```

Optimized build will be in the `build/` directory.

## Project Structure

```
frontend/
├── public/                # Static files
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ErrorBoundary.js
│   ├── pages/           # Page components
│   │   ├── HomePage.js
│   │   ├── DashboardPage.js
│   │   └── VideoEditorPage.js
│   ├── services/        # API services
│   │   ├── apiService.js
│   │   └── videoApiService.js
│   ├── hooks/           # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── App.js          # Main app component
│   ├── App.css         # App styles
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
├── craco.config.js     # CRACO configuration
└── README.md           # This file
```

## Key Pages

### Home Page (`/`)
- Landing page with feature showcase
- Call-to-action buttons
- Navigation to editor

### Dashboard (`/dashboard`)
- System health monitoring
- Status checks management
- Quick stats

### Video Editor (`/editor`)
- Main editing interface
- Video upload and library
- Video player with controls
- Editing tools (trim, captions)
- Progress tracking
- Results download

## API Integration

The frontend communicates with the backend via REST API. See `src/services/videoApiService.js` for all API methods.

Key API methods:
- `uploadVideo(file, onProgress)` - Upload with progress callback
- `trimVideo(videoId, start, end)` - Trim video
- `generateCaptions(videoId, language)` - Generate AI captions
- `pollJobStatus(jobId, onProgress)` - Poll processing status

## Styling

The app uses Tailwind CSS with a custom theme defined in `tailwind.config.js` and CSS variables in `index.css`.

### Color Scheme
- Light and dark mode support
- Customizable via CSS variables
- Consistent component theming

## Component Library

Built with shadcn/ui components:
- Button, Card, Input, Label
- Alert, Badge, Progress
- Tabs, Dialog, Toast
- And more...

All components are customizable and located in `src/components/ui/`.

## Development

### Linting

```bash
yarn lint
```

### Testing

```bash
yarn test
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_BACKEND_URL` | Backend API URL | Yes |
| `WDS_SOCKET_PORT` | WebSocket port for dev server | No |
| `REACT_APP_ENABLE_VISUAL_EDITS` | Enable visual editing | No |
| `ENABLE_HEALTH_CHECK` | Enable health check plugin | No |

## Building for Production

1. Update `.env` with production backend URL
2. Run build command:
   ```bash
   yarn build
   ```
3. Deploy `build/` directory to your hosting service

### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3 + CloudFront**: Upload build folder
- **Nginx**: Serve build folder with proper routing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with React.lazy
- Optimized bundle size
- Image optimization
- Lazy loading for videos

## Troubleshooting

### Port already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Module not found
```bash
rm -rf node_modules yarn.lock
yarn install
```

### CORS errors
Ensure backend has correct CORS configuration allowing your frontend origin.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
