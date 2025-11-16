import ffmpeg
import os
import uuid
import subprocess
import json
from pathlib import Path
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class VideoProcessor:
    """Handle video processing operations using FFmpeg"""
    
    def __init__(self, upload_dir: str):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    def get_video_info(self, video_path: str) -> Dict[str, Any]:
        """Get video metadata using ffprobe"""
        try:
            probe = ffmpeg.probe(video_path)
            video_info = next(s for s in probe['streams'] if s['codec_type'] == 'video')
            audio_info = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
            
            duration = float(probe['format']['duration'])
            
            return {
                'duration': duration,
                'width': int(video_info['width']),
                'height': int(video_info['height']),
                'fps': eval(video_info['r_frame_rate']),
                'codec': video_info['codec_name'],
                'has_audio': audio_info is not None,
                'audio_codec': audio_info['codec_name'] if audio_info else None,
                'file_size': int(probe['format']['size']),
                'bitrate': int(probe['format']['bit_rate'])
            }
        except Exception as e:
            logger.error(f"Error getting video info: {e}")
            raise
    
    def trim_video(self, input_path: str, start_time: float, end_time: float, output_filename: str) -> str:
        """Trim video between start and end time"""
        try:
            output_path = str(self.upload_dir / output_filename)
            
            # Use ffmpeg to trim video
            (
                ffmpeg
                .input(input_path, ss=start_time, to=end_time)
                .output(output_path, codec='copy', avoid_negative_ts='make_zero')
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            
            logger.info(f"Video trimmed successfully: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            logger.error(f"FFmpeg error during trim: {e.stderr.decode()}")
            raise Exception(f"Failed to trim video: {e.stderr.decode()}")
    
    def cut_video(self, input_path: str, segments: List[Dict[str, float]], output_filename: str) -> str:
        """Cut video into segments and concatenate them"""
        try:
            temp_files = []
            concat_file = str(self.upload_dir / f"concat_{uuid.uuid4()}.txt")
            
            # Create individual segments
            for i, segment in enumerate(segments):
                temp_output = str(self.upload_dir / f"temp_segment_{i}_{uuid.uuid4()}.mp4")
                
                (
                    ffmpeg
                    .input(input_path, ss=segment['start'], to=segment['end'])
                    .output(temp_output, codec='copy', avoid_negative_ts='make_zero')
                    .overwrite_output()
                    .run(capture_stdout=True, capture_stderr=True)
                )
                
                temp_files.append(temp_output)
            
            # Create concat file
            with open(concat_file, 'w') as f:
                for temp_file in temp_files:
                    f.write(f"file '{temp_file}'\n")
            
            # Concatenate segments
            output_path = str(self.upload_dir / output_filename)
            (
                ffmpeg
                .input(concat_file, format='concat', safe=0)
                .output(output_path, codec='copy')
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            
            # Cleanup temp files
            for temp_file in temp_files:
                os.remove(temp_file)
            os.remove(concat_file)
            
            logger.info(f"Video cut successfully: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Error cutting video: {e}")
            raise
    
    def extract_audio(self, video_path: str, output_filename: str) -> str:
        """Extract audio from video for transcription"""
        try:
            output_path = str(self.upload_dir / output_filename)
            
            (
                ffmpeg
                .input(video_path)
                .output(output_path, acodec='libmp3lame', ac=1, ar='16000')
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            
            logger.info(f"Audio extracted successfully: {output_path}")
            return output_path
        except ffmpeg.Error as e:
            logger.error(f"FFmpeg error during audio extraction: {e.stderr.decode()}")
            raise Exception(f"Failed to extract audio: {e.stderr.decode()}")
    
    def add_subtitles(self, video_path: str, subtitle_path: str, output_filename: str) -> str:
        """Add subtitles to video"""
        try:
            output_path = str(self.upload_dir / output_filename)
            
            (
                ffmpeg
                .input(video_path)
                .output(output_path, vf=f"subtitles={subtitle_path}")
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            
            logger.info(f"Subtitles added successfully: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Error adding subtitles: {e}")
            raise
    
    def get_thumbnail(self, video_path: str, timestamp: float, output_filename: str) -> str:
        """Generate thumbnail from video at specific timestamp"""
        try:
            output_path = str(self.upload_dir / output_filename)
            
            (
                ffmpeg
                .input(video_path, ss=timestamp)
                .output(output_path, vframes=1)
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True)
            )
            
            logger.info(f"Thumbnail generated: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Error generating thumbnail: {e}")
            raise
