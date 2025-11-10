import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsletterCardProps {
  title: string;
  date: string;
  excerpt: string;
  link?: string;
}

const NewsletterCard = ({ title, date, excerpt, link }: NewsletterCardProps) => {
  // Truncate excerpt to max 200 characters for faster rendering and consistent card heights
  const truncatedExcerpt = excerpt.length > 200 
    ? excerpt.substring(0, 200).trim() + '...' 
    : excerpt;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-2">{date}</div>
        <CardTitle className="text-xl line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-muted-foreground mb-4 line-clamp-4">{truncatedExcerpt}</p>
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
