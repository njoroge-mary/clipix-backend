import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Video,
  ArrowLeft,
  Upload,
  Scissors,
  Download,
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Loader2,
  FileVideo,
  Clock
} from 'lucide-react';
import videoApiService from '@/services/videoApiService';

const VideoEditorPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoPlayerRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Trim controls
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Processing
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  // Results
  const [processedResult, setProcessedResult] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      setTrimStart(0);
      setTrimEnd(selectedVideo.duration || 0);
    }
  }, [selectedVideo]);

  const loadVideos = async () => {
    try {
      const data = await videoApiService.listVideos();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load videos');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleVideoUpload(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleVideoUpload(file);
    } else {
      toast.error('Please drop a video file');
    }
  };

  const handleVideoUpload = async (file) => {
    // Check file size (10GB = 10 * 1024 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds 10GB limit');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await videoApiService.uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });

      toast.success(`Video uploaded: ${result.filename}`);
      loadVideos();
      setSelectedVideo(result);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const selectVideo = async (video) => {
    try {
      const videoInfo = await videoApiService.getVideoInfo(video.video_id);
      setSelectedVideo(videoInfo);
      setCurrentTime(0);
      setProcessedResult(null);
    } catch (error) {
      console.error('Error selecting video:', error);
      toast.error('Failed to load video');
    }
  };

  const handlePlayPause = () => {
    if (videoPlayerRef.current) {
      if (isPlaying) {
        videoPlayerRef.current.pause();
      } else {
        videoPlayerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoPlayerRef.current) {
      setCurrentTime(videoPlayerRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoPlayerRef.current) {
      setDuration(videoPlayerRef.current.duration);
    }
  };

  const handleSeek = (event) => {
    const seekTime = parseFloat(event.target.value);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const setTrimStartToCurrent = () => {
    setTrimStart(Math.floor(currentTime * 100) / 100);
  };

  const setTrimEndToCurrent = () => {
    setTrimEnd(Math.floor(currentTime * 100) / 100);
  };

  const handleTrimVideo = async () => {
    if (!selectedVideo) return;

    if (trimStart >= trimEnd) {
      toast.error('Start time must be less than end time');
      return;
    }

    setProcessing(true);
    setProcessingMessage('Trimming video...');
    setProcessingProgress(0);

    try {
      const jobResult = await videoApiService.trimVideo(
        selectedVideo.video_id,
        trimStart,
        trimEnd
      );

      const finalResult = await videoApiService.pollJobStatus(
        jobResult.job_id,
        (status) => {
          setProcessingProgress(status.progress * 100);
          setProcessingMessage(status.message || 'Processing...');
        }
      );

      setProcessedResult(finalResult.result);
      toast.success('Video trimmed successfully!');
    } catch (error) {
      console.error('Trim error:', error);
      toast.error('Failed to trim video');
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateCaptions = async () => {
    if (!selectedVideo) return;

    setProcessing(true);
    setProcessingMessage('Generating captions...');
    setProcessingProgress(0);

    try {
      const jobResult = await videoApiService.generateCaptions(selectedVideo.video_id);

      const finalResult = await videoApiService.pollJobStatus(
        jobResult.job_id,
        (status) => {
          setProcessingProgress(status.progress * 100);
          setProcessingMessage(status.message || 'Processing...');
        }
      );

      setProcessedResult(finalResult.result);
      toast.success('Captions generated successfully!');
    } catch (error) {
      console.error('Caption error:', error);
      toast.error('Failed to generate captions');
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b" data-testid="video-editor-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              data-testid="back-btn"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">AI Video Editor</h1>
            </div>
          </div>
          <Badge variant="secondary">Phase 1 MVP</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload & Video List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Card */}
            <Card data-testid="upload-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Video</span>
                </CardTitle>
                <CardDescription>Max 10GB per file</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  data-testid="drop-zone"
                >
                  {uploading ? (
                    <div className="space-y-4">
                      <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                      <p className="text-sm">Uploading... {uploadProgress}%</p>
                      <Progress value={uploadProgress} />
                    </div>
                  ) : (
                    <>
                      <FileVideo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-medium mb-2">Drop video here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    data-testid="file-input"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Video List */}
            <Card>
              <CardHeader>
                <CardTitle>My Videos ({videos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videos.map((video) => (
                    <div
                      key={video.video_id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVideo?.video_id === video.video_id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => selectVideo(video)}
                      data-testid={`video-item-${video.video_id}`}
                    >
                      <p className="font-medium truncate">{video.filename}</p>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(video.duration)}
                        </span>
                        <span>{formatFileSize(video.file_size)}</span>
                      </div>
                    </div>
                  ))}
                  {videos.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No videos uploaded yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Video Player & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {selectedVideo ? (
              <>
                {/* Video Player */}
                <Card data-testid="video-player-card">
                  <CardContent className="p-6">
                    <div className="bg-black rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoPlayerRef}
                        className="w-full"
                        src={videoApiService.getVideoStreamUrl(selectedVideo.video_id)}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        data-testid="video-player"
                      />
                    </div>

                    {/* Video Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            if (videoPlayerRef.current) {
                              videoPlayerRef.current.currentTime = Math.max(0, currentTime - 5);
                            }
                          }}
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={handlePlayPause}
                          data-testid="play-pause-btn"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            if (videoPlayerRef.current) {
                              videoPlayerRef.current.currentTime = Math.min(
                                duration,
                                currentTime + 5
                              );
                            }
                          }}
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      {/* Timeline Slider */}
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        step="0.1"
                        className="w-full"
                        data-testid="timeline-slider"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Editing Tools */}
                <Card>
                  <CardHeader>
                    <CardTitle>Editing Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="trim">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="trim">Trim</TabsTrigger>
                        <TabsTrigger value="captions">Captions</TabsTrigger>
                      </TabsList>

                      {/* Trim Tab */}
                      <TabsContent value="trim" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Time (seconds)</Label>
                            <div className="flex space-x-2 mt-2">
                              <Input
                                type="number"
                                value={trimStart}
                                onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                                min="0"
                                max={duration}
                                step="0.1"
                                data-testid="trim-start-input"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={setTrimStartToCurrent}
                              >
                                Set
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>End Time (seconds)</Label>
                            <div className="flex space-x-2 mt-2">
                              <Input
                                type="number"
                                value={trimEnd}
                                onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                                min="0"
                                max={duration}
                                step="0.1"
                                data-testid="trim-end-input"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={setTrimEndToCurrent}
                              >
                                Set
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={handleTrimVideo}
                          disabled={processing}
                          data-testid="trim-btn"
                        >
                          <Scissors className="h-4 w-4 mr-2" />
                          Trim Video
                        </Button>
                      </TabsContent>

                      {/* Captions Tab */}
                      <TabsContent value="captions" className="space-y-4">
                        <Alert>
                          <Sparkles className="h-4 w-4" />
                          <AlertDescription>
                            AI will automatically generate captions from your video's audio using
                            advanced speech recognition.
                          </AlertDescription>
                        </Alert>
                        <Button
                          className="w-full"
                          onClick={handleGenerateCaptions}
                          disabled={processing}
                          data-testid="generate-captions-btn"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate AI Captions
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Processing Progress */}
                {processing && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{processingMessage}</p>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(processingProgress)}%
                          </span>
                        </div>
                        <Progress value={processingProgress} />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Results */}
                {processedResult && !processing && (
                  <Card data-testid="results-card">
                    <CardHeader>
                      <CardTitle className="text-green-600">Processing Complete!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {processedResult.download_url && (
                        <Button
                          className="w-full"
                          onClick={() =>
                            window.open(
                              videoApiService.getDownloadUrl(processedResult.result_id),
                              '_blank'
                            )
                          }
                          data-testid="download-video-btn"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Edited Video
                        </Button>
                      )}
                      {processedResult.srt_url && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              window.open(
                                videoApiService.getSrtUrl(processedResult.caption_id),
                                '_blank'
                              )
                            }
                          >
                            Download SRT
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              window.open(
                                videoApiService.getVttUrl(processedResult.caption_id),
                                '_blank'
                              )
                            }
                          >
                            Download VTT
                          </Button>
                        </div>
                      )}
                      {processedResult.text && (
                        <div className="border rounded-lg p-4 bg-muted">
                          <p className="text-sm font-medium mb-2">Transcription:</p>
                          <p className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {processedResult.text}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Video Selected</h3>
                  <p className="text-muted-foreground">
                    Upload a video or select one from your library to start editing
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorPage;
