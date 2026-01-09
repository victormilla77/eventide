'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCcw, Video, Film, Square } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CameraCaptureProps {
    capturedMedia: string | null;
    setCapturedMedia: (media: string | null) => void;
    mediaType: 'photo' | 'video';
    setMediaType: (type: 'photo' | 'video') => void;
}

export default function CameraCapture({ capturedMedia, setCapturedMedia, mediaType, setMediaType }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const stopStream = useCallback(() => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
  }, [stream]);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (hasCameraPermission === null) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setHasCameraPermission(true);
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera and microphone permissions in your browser settings.',
          });
        }
      }
    };

    if(!capturedMedia) {
        getCameraPermission();
    } else {
        stopStream();
    }

    return () => {
        stopStream();
    }
  }, [toast, hasCameraPermission, capturedMedia, stopStream]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedMedia(dataUrl);
      }
    }
  };
  
  const startRecording = () => {
    if (stream && videoRef.current) {
        setIsRecording(true);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current = recorder;
        const chunks: Blob[] = [];
        
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(blob);
            setCapturedMedia(videoUrl);
        };

        recorder.start();
    }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  }

  const handleCapture = () => {
    if (mediaType === 'photo') {
        takePhoto();
    } else {
        if(isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }
  }

  const retake = () => {
    setCapturedMedia(null);
  };
  
  const handleTabChange = (value: string) => {
    setMediaType(value as 'photo' | 'video');
  };

  return (
    <div className="py-4 space-y-4">
      <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-muted">
        {capturedMedia ? (
             mediaType === 'photo' ? (
                <img src={capturedMedia} alt="Captured" className="w-full h-full object-cover" />
             ) : (
                <video src={capturedMedia} className="w-full h-full object-cover" controls autoPlay loop />
             )
        ) : (
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        )}
        {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <Camera className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="font-semibold">Camera access is required.</p>
                <p className="text-sm text-muted-foreground">Please allow camera permissions to use this feature.</p>
            </div>
        )}
         {isRecording && (
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-destructive text-destructive-foreground rounded-full px-3 py-1 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                REC
            </div>
        )}
      </div>

      {hasCameraPermission ? (
        <div className="flex flex-col items-center gap-4">
            {!capturedMedia && (
                 <Tabs value={mediaType} onValueChange={handleTabChange} className="w-full max-w-xs">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="photo"><Camera className="mr-2"/>Photo</TabsTrigger>
                        <TabsTrigger value="video"><Video className="mr-2"/>Video</TabsTrigger>
                    </TabsList>
                </Tabs>
            )}
         
          {capturedMedia ? (
              <Button variant="outline" onClick={retake}>
                <RefreshCcw className="mr-2" /> Retake
              </Button>
          ) : (
            <Button onClick={handleCapture} size="lg" className="rounded-full w-16 h-16">
              {mediaType === 'photo' ? <Camera /> : (isRecording ? <Square /> : <Film />) }
              <span className="sr-only">{mediaType === 'photo' ? 'Take Photo' : (isRecording ? 'Stop Recording' : 'Start Recording')}</span>
            </Button>
          )}
        </div>
      ) : hasCameraPermission === false && (
         <Alert variant="destructive">
            <Camera className="h-4 w-4" />
            <AlertTitle>Camera Access Denied</AlertTitle>
            <AlertDescription>
                To capture photos or videos, you must allow camera access in your browser settings.
            </AlertDescription>
        </Alert>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
