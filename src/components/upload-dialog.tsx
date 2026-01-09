import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Camera as CameraIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CameraCapture from './camera-capture';

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
    const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');

    const handleUpload = () => {
        // Handle the upload of file or captured media
        if (capturedMedia) {
            console.log(`Uploading captured ${mediaType}...`);
            // Reset state and close
            setCapturedMedia(null);
            onOpenChange(false);
        } else {
            console.log("Uploading selected file...");
            onOpenChange(false);
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setCapturedMedia(null);
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Upload Media</DialogTitle>
                    <DialogDescription>Share your photos and videos from the event!</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload"><UploadCloud className="mr-2"/> From Device</TabsTrigger>
                        <TabsTrigger value="camera"><CameraIcon className="mr-2"/> Use Camera</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                         <div className="py-4 space-y-4">
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, or MP4 (MAX. 50MB)</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="camera">
                        <CameraCapture 
                            capturedMedia={capturedMedia} 
                            setCapturedMedia={setCapturedMedia}
                            mediaType={mediaType}
                            setMediaType={setMediaType}
                        />
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleUpload} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!capturedMedia}>Upload</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
