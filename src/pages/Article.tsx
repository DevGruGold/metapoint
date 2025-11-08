import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import NewsletterCard from '@/components/NewsletterCard';

const Article = () => {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ['related-articles', article?.category],
    queryFn: async () => {
      if (!article) return [];
      
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('category', article.category)
        .neq('id', article.id)
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!article,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/archive">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Archive
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-navy to-primary/20">
        <div className="container mx-auto px-4 py-12">
          <Link to="/archive">
            <Button variant="ghost" className="text-white hover:text-white/80 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Archive
            </Button>
          </Link>
          
          <article className="max-w-4xl">
            <div className="inline-block px-3 py-1 bg-orange text-white text-sm font-semibold rounded mb-4">
              {article.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.published_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          <div className="text-xl text-muted-foreground mb-8 pb-8 border-b border-border">
            {article.excerpt}
          </div>

          {/* Full Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {article.full_content}
            </div>
          </div>

          {/* External Link */}
          {article.external_link && (
            <div className="mb-12 p-6 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                This article was originally published on our newsletter platform
              </p>
              <a
                href={article.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-orange hover:text-orange/80 font-semibold"
              >
                Read on original platform
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6" />
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.id} to={`/articles/${related.slug}`}>
                    <NewsletterCard
                      title={related.title}
                      date={new Date(related.published_date).toLocaleDateString()}
                      excerpt={related.excerpt}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
