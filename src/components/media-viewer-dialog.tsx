'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"
import type { MediaItem } from '@/lib/data';
import Image from 'next/image';
import { Twitter, Facebook, Link as LinkIcon } from 'lucide-react';

interface MediaViewerDialogProps {
    mediaItem: MediaItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function MediaViewerDialog({ mediaItem, open, onOpenChange }: MediaViewerDialogProps) {
    const { toast } = useToast();

    if (!mediaItem) {
        return null;
    }
    
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareUrl = `${pageUrl}#${mediaItem.id}`;

    const socialShareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(mediaItem.description)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast({
                title: 'Link Copied!',
                description: 'The link to this image has been copied to your clipboard.',
            });
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            toast({
                variant: 'destructive',
                title: 'Copy Failed',
                description: 'Could not copy the link to your clipboard.',
            });
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative aspect-square md:aspect-auto">
                        <Image
                            src={mediaItem.url}
                            alt={mediaItem.description}
                            fill
                            className="object-contain"
                            data-ai-hint={mediaItem.imageHint}
                        />
                    </div>
                    <div className="flex flex-col p-6">
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold mb-2">{mediaItem.description}</h2>
                            <p className="text-sm text-muted-foreground">Uploaded by {mediaItem.uploader}</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Share this moment</p>
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="icon">
                                    <a href={socialShareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                                        <Twitter />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="icon">
                                    <a href={socialShareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                                        <Facebook />
                                    </a>
                                </Button>
                                <Button variant="outline" size="icon" onClick={handleCopyLink} aria-label="Copy link">
                                    <LinkIcon />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
