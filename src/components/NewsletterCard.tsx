import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsletterCardProps {
  title: string;
  date: string;
  excerpt: string;
  link?: string;
}

const NewsletterCard = ({ title, date, excerpt, link }: NewsletterCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-2">{date}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{excerpt}</p>
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
