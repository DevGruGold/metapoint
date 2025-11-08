import { useState } from 'react';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ArticlePreviewProps {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedDate: string;
  featuredImage?: string;
  author?: string;
  onClose: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export const ArticlePreview = ({
  title,
  excerpt,
  content,
  category,
  publishedDate,
  featuredImage,
  author = 'Maya Joelson',
  onClose,
}: ArticlePreviewProps) => {
  const [device, setDevice] = useState<DeviceType>('desktop');

  const deviceSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  const formattedDate = publishedDate 
    ? new Date(publishedDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Article Preview</h2>
              
              {/* Device Selector */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={device === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevice('desktop')}
                  className="gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </Button>
                <Button
                  variant={device === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevice('tablet')}
                  className="gap-2"
                >
                  <Tablet className="h-4 w-4" />
                  <span className="hidden sm:inline">Tablet</span>
                </Button>
                <Button
                  variant={device === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevice('mobile')}
                  className="gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </Button>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div
          className={cn(
            'transition-all duration-300 bg-background border shadow-xl rounded-lg overflow-hidden',
            deviceSizes[device],
            device !== 'desktop' && 'mx-auto'
          )}
          style={{
            minHeight: device === 'mobile' ? '667px' : device === 'tablet' ? '1024px' : 'auto',
          }}
        >
          {/* Article Content */}
          <article className="p-6 md:p-8 lg:p-12">
            {/* Category Badge */}
            <div className="mb-4">
              <Badge variant="secondary" className="text-sm">
                {category || 'Uncategorized'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {title || 'Untitled Article'}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <span className="font-medium">By {author}</span>
              </div>
              {formattedDate && (
                <>
                  <span>•</span>
                  <time dateTime={publishedDate}>{formattedDate}</time>
                </>
              )}
            </div>

            {/* Featured Image */}
            {featuredImage && (
              <div className="mb-8 -mx-6 md:-mx-8 lg:-mx-12">
                <img
                  src={featuredImage}
                  alt={title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            )}

            {/* Excerpt */}
            {excerpt && (
              <div className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium border-l-4 border-primary pl-6">
                {excerpt}
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
            />

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                  {author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{author}</h3>
                  <p className="text-sm text-muted-foreground">
                    Founder of Meta Point Advisors, providing global market insights and thought leadership in investing.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Device Frame Indicator */}
      {device !== 'desktop' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card border rounded-full px-4 py-2 shadow-lg">
          <p className="text-sm text-muted-foreground">
            {device === 'mobile' ? '375 × 667px' : '768 × 1024px'}
          </p>
        </div>
      )}
    </div>
  );
};
