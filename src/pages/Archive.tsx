import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import NewsletterCard from "@/components/NewsletterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { featuredArticles } from "@/data/featuredArticles";

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: databaseArticles = [], isLoading } = useQuery({
    queryKey: ['newsletters'],
    queryFn: async () => {
      // OPTIMIZED: Only select fields needed for teaser cards, NOT full_content
      const { data, error } = await supabase
        .from('newsletters')
        .select('id, title, slug, excerpt, published_date, category, author, featured_image, external_link')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Combine database articles with featured articles
  // Featured articles appear first, then database articles
  const allArticles = [
    ...featuredArticles,
    ...databaseArticles
  ];

  const filteredArticles = allArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Hero
        title="Newsletter Archive"
        subtitle="Explore our complete collection of market insights and investment analysis"
      />

      <section className="py-10 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles by title, topic, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
            </div>

            {/* Filter Info */}
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Showing {filteredArticles.length} of {allArticles.length} articles
              </p>
            </div>

            {/* Articles Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => {
                  // Check if this is a featured article (has external_link) or database article
                  const isExternal = 'external_link' in article && article.external_link;
                  const link = isExternal 
                    ? article.external_link 
                    : `/articles/${article.slug}`;
                  
                  return (
                    <a 
                      key={article.id} 
                      href={link}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="block hover:scale-[1.02] transition-transform"
                    >
                      <NewsletterCard
                        title={article.title}
                        date={new Date(article.published_date).toLocaleDateString()}
                        excerpt={article.excerpt}
                        image={article.featured_image}
                      />
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No articles found matching your search.</p>
                <Button
                  variant="link"
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-orange"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Substack Archive Link */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-light-gray rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">View Complete Archive</h3>
              <p className="text-muted-foreground mb-6">
                Browse the complete collection of articles and insights on Substack.
              </p>
              <a 
                href="https://metapointadvisors.substack.com/archive" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="orange" size="lg">
                  View Full Archive on Substack
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Archive;
