# Clipix Backend - AI Video Editor API

## Overview

Backend API for Clipix AI Video Editor built with FastAPI, FFmpeg, and OpenAI Whisper for AI-powered video editing and caption generation.

## Features

- **Video Upload**: Handle videos up to 10GB
- **Video Processing**: Trim, cut, and merge videos using FFmpeg
- **AI Caption Generation**: Automatic speech-to-text using OpenAI Whisper
- **Background Jobs**: Async processing with real-time progress tracking
- **File Management**: Local storage with streaming support
- **Subtitle Export**: Generate SRT and VTT subtitle files

## Tech Stack

- **Framework**: FastAPI 0.110.1
- **Video Processing**: FFmpeg, ffmpeg-python
- **AI Transcription**: OpenAI Whisper via emergentintegrations
- **Database**: MongoDB with Motor (async driver)
- **Storage**: Local file system

## Prerequisites

- Python 3.11+
- FFmpeg installed on system
- MongoDB running
- Emergent LLM Key (or OpenAI API key)

## Installation

### 1. Install FFmpeg

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Install emergentintegrations (for AI features)

```bash
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
```

### 4. Configure Environment

Create a `.env` file in the backend directory:

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="clipix_db"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=your_key_here
```

## Running the Server

```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## Key Endpoints

### Video Management
- `POST /api/video/upload` - Upload video (max 10GB)
- `GET /api/video/{video_id}/info` - Get video metadata
- `GET /api/video/{video_id}/stream` - Stream video
- `GET /api/videos` - List all videos

### Video Editing
- `POST /api/video/trim` - Trim video
- `POST /api/video/cut` - Cut and merge video segments

### AI Features
- `POST /api/video/captions` - Generate AI captions
- `GET /api/captions/{id}/srt` - Download SRT subtitles
- `GET /api/captions/{id}/vtt` - Download VTT subtitles

### Processing
- `GET /api/job/{job_id}` - Check job status
- `GET /api/video/download/{result_id}` - Download processed video

### Health
- `GET /api/health` - Health check endpoint

## Project Structure

```
backend/
├── server.py              # Main FastAPI application
├── video_processor.py     # FFmpeg video processing
├── caption_generator.py   # AI caption generation
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (not in git)
├── uploads/              # Video storage (not in git)
└── README.md             # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | Yes |
| `DB_NAME` | Database name | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | Yes |
| `EMERGENT_LLM_KEY` | API key for AI features | Yes |

## Development

### Linting

```bash
ruff check .
```

### Testing

```bash
pytest
```

## Production Considerations

1. **Storage**: Use cloud storage (S3, GCS) instead of local files
2. **Job Queue**: Use Redis/Celery for background jobs
3. **CDN**: Serve videos through CDN for better performance
4. **Rate Limiting**: Implement rate limiting for uploads
5. **Authentication**: Add user authentication and authorization
6. **Monitoring**: Add logging and monitoring (Sentry, etc.)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
