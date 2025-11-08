import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  Upload,
  Loader2,
  Library,
  Video,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ImageCropModal from './ImageCropModal';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { data: libraryImages = [] } = useQuery({
    queryKey: ['media-library-select'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('article-images')
        .list('', {
          limit: 50,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      return data.map((file) => {
        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: publicUrl,
        };
      });
    },
    enabled: imageDialogOpen,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 640,
        height: 360,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setLinkDialogOpen(false);
    }
  };

  const uploadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return null;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleCroppedImage = useCallback(async (croppedFile: File) => {
    const url = await uploadImage(croppedFile);
    if (url) {
      setImageUrl(url);
      setImageDialogOpen(true);
    }
  }, [uploadImage]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Open crop modal first
    setPendingImageFile(file);
    setCropModalOpen(true);
    e.target.value = ''; // Reset input
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Open crop modal for dropped images too
    setPendingImageFile(file);
    setCropModalOpen(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const addImage = () => {
    if (imageUrl) {
      const imgHtml = imageCaption
        ? `<figure><img src="${imageUrl}" alt="${imageCaption}" /><figcaption>${imageCaption}</figcaption></figure>`
        : `<img src="${imageUrl}" alt="Article image" />`;
      
      editor.chain().focus().insertContent(imgHtml).run();
      setImageUrl('');
      setImageCaption('');
      setImageDialogOpen(false);
    }
  };

  const addVideo = () => {
    if (!videoUrl || !editor) {
      toast.error('Please enter a video URL');
      return;
    }

    try {
      // Try to add as YouTube video first
      editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run();
      setVideoUrl('');
      setVideoDialogOpen(false);
      toast.success('Video embedded successfully');
    } catch (error) {
      // If not YouTube, try as iframe embed
      const iframeHtml = `<div class="video-container"><iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe></div>`;
      editor.chain().focus().insertContent(iframeHtml).run();
      setVideoUrl('');
      setVideoDialogOpen(false);
      toast.success('Video embedded successfully');
    }
  };

  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-colors ${
        dragActive ? 'border-primary border-2 bg-primary/5' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {dragActive && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-primary font-semibold text-lg">Drop image here</div>
        </div>
      )}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setLinkDialogOpen(true)}
        >
          <Link2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setImageDialogOpen(true)}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setVideoDialogOpen(true)}
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>
      
      {dragActive && (
        <div className="p-4 bg-primary/5 border-t border-primary/20 text-center text-sm text-primary">
          Drop your image here to upload
        </div>
      )}

      <EditorContent editor={editor} className="bg-background" />

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              Add a URL to create a hyperlink
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLink();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addLink}>Insert Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>
              Upload a new image, select from library, or paste a URL
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="image-file">Upload Image</Label>
                <div className="mt-2">
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="library" className="mt-4">
              <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
                {libraryImages.length > 0 ? (
                  libraryImages.map((img) => (
                    <button
                      key={img.name}
                      onClick={() => setImageUrl(img.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        imageUrl === img.url ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      {imageUrl === img.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground rounded-full p-2">
                            ✓
                          </div>
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    No images in library. Upload some first!
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="image-caption">Caption (Optional)</Label>
              <Input
                id="image-caption"
                placeholder="Image description"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImage();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addImage} disabled={!imageUrl || isUploading}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed Video</DialogTitle>
            <DialogDescription>
              Paste a YouTube, Vimeo, or other video embed URL
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addVideo();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supports YouTube, Vimeo, and iframe embed URLs
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVideoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addVideo} disabled={!videoUrl}>
              Embed Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageCropModal
        open={cropModalOpen}
        onOpenChange={setCropModalOpen}
        imageFile={pendingImageFile}
        onCropComplete={handleCroppedImage}
      />
    </div>
  );
};

export default RichTextEditor;
