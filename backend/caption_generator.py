import os
import asyncio
from pathlib import Path
from typing import Optional, Dict, List
import logging
from emergentintegrations.llm.openai import OpenAISpeechToText
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class CaptionGenerator:
    """Generate captions using OpenAI Whisper"""
    
    def __init__(self):
        api_key = os.getenv('EMERGENT_LLM_KEY')
        if not api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment")
        
        self.stt = OpenAISpeechToText(api_key=api_key)
        logger.info("CaptionGenerator initialized with Emergent LLM Key")
    
    async def generate_captions(self, audio_path: str, language: Optional[str] = None) -> Dict:
        """Generate captions from audio file"""
        try:
            with open(audio_path, 'rb') as audio_file:
                logger.info(f"Transcribing audio: {audio_path}")
                
                # Use verbose_json to get timestamps
                response = await self.stt.transcribe(
                    file=audio_file,
                    model="whisper-1",
                    response_format="verbose_json",
                    language=language,
                    timestamp_granularities=["segment", "word"]
                )
                
                logger.info(f"Transcription completed: {len(response.text)} characters")
                
                # Extract segments with timestamps
                segments = []
                if hasattr(response, 'segments'):
                    for segment in response.segments:
                        segments.append({
                            'start': segment.start,
                            'end': segment.end,
                            'text': segment.text.strip()
                        })
                
                return {
                    'text': response.text,
                    'language': response.language if hasattr(response, 'language') else language,
                    'segments': segments,
                    'duration': response.duration if hasattr(response, 'duration') else None
                }
        except Exception as e:
            logger.error(f"Error generating captions: {e}")
            raise
    
    def generate_srt(self, segments: List[Dict], output_path: str) -> str:
        """Generate SRT subtitle file from segments"""
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                for i, segment in enumerate(segments, 1):
                    start_time = self._format_timestamp(segment['start'])
                    end_time = self._format_timestamp(segment['end'])
                    
                    f.write(f"{i}\n")
                    f.write(f"{start_time} --> {end_time}\n")
                    f.write(f"{segment['text']}\n\n")
            
            logger.info(f"SRT file generated: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Error generating SRT: {e}")
            raise
    
    def generate_vtt(self, segments: List[Dict], output_path: str) -> str:
        """Generate VTT subtitle file from segments"""
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write("WEBVTT\n\n")
                
                for segment in segments:
                    start_time = self._format_timestamp_vtt(segment['start'])
                    end_time = self._format_timestamp_vtt(segment['end'])
                    
                    f.write(f"{start_time} --> {end_time}\n")
                    f.write(f"{segment['text']}\n\n")
            
            logger.info(f"VTT file generated: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Error generating VTT: {e}")
            raise
    
    @staticmethod
    def _format_timestamp(seconds: float) -> str:
        """Format seconds to SRT timestamp (HH:MM:SS,mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
    
    @staticmethod
    def _format_timestamp_vtt(seconds: float) -> str:
        """Format seconds to VTT timestamp (HH:MM:SS.mmm)"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"
