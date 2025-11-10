import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsletterCardProps {
  title: string;
  date: string;
  excerpt: string;
  link?: string;
  image?: string;
}

const NewsletterCard = ({ title, date, excerpt, link, image }: NewsletterCardProps) => {
  // Truncate excerpt to max 200 characters for faster rendering and consistent card heights
  const truncatedExcerpt = excerpt.length > 200 
    ? excerpt.substring(0, 200).trim() + '...' 
    : excerpt;

  // Default placeholder image if none provided
  const displayImage = image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col overflow-hidden">
      {/* Featured Image */}
      <div className="w-full h-48 overflow-hidden bg-gray-200">
        <img 
          src={displayImage} 
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to default image if image fails to load
            e.currentTarget.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80';
          }}
        />
      </div>
      
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-2">{date}</div>
        <CardTitle className="text-xl line-clamp-2">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-muted-foreground mb-4 line-clamp-3">{truncatedExcerpt}</p>
        {link && (
          <Button variant="link" className="p-0 h-auto text-orange hover:text-orange/80">
            Read More →
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterCard;
