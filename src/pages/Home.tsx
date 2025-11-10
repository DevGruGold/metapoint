import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import NewsletterCard from "@/components/NewsletterCard";
import { Button } from "@/components/ui/button";
import mayaImage from "@/assets/maya.jpg";
import { featuredArticles, type FeaturedArticle } from "@/data/featuredArticles";

const Home = () => {
  const { data: databaseArticles = [], isLoading } = useQuery({
    queryKey: ['featured-newsletters'],
    queryFn: async (): Promise<any[]> => {
      // OPTIMIZED: Only select fields needed for teaser cards, NOT full_content
      const query = (supabase.from('newsletters') as any).select('id, title, slug, excerpt, published_date, category, author, featured_image, external_link').eq('is_featured', true).order('published_date', { ascending: false }).limit(3);
      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  // Combine database articles with featured articles from data file
  // Show first 3 featured articles if no database articles
  const displayArticles: any[] = databaseArticles.length > 0 
    ? databaseArticles 
    : featuredArticles.slice(0, 3);

  const hasArticles = displayArticles.length > 0;

  return (
    <>
      <Hero
        title="Global Market Insights & Thought Leadership"
        subtitle="Meta Point Advisors provides global market insights and thought leadership in the realm of investing, cutting through financial complexities and groupthink. Our approach and insights have a record of being ahead of the curve."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/subscribe">
            <Button variant="orange" size="lg" className="px-8">
              Subscribe to Newsletter
            </Button>
          </Link>
          <Link to="/advisors">
            <Button variant="navy" size="lg" className="px-8 border border-white/20">
              Learn About Advisory Services
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Latest Insights Section */}
      <section className="py-10 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Latest Insights from The Meta Point
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : hasArticles ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {displayArticles.map((article) => {
                  // Check if this is a featured article (external_link) or database article (slug)
                  const isFeatured = 'external_link' in article && article.external_link && !('slug' in article);
                  const link = isFeatured 
                    ? article.external_link 
                    : `/articles/${'slug' in article ? article.slug : ''}`;
                  
                  return (
                    <a 
                      key={article.id} 
                      href={link}
                      target={isFeatured ? "_blank" : undefined}
                      rel={isFeatured ? "noopener noreferrer" : undefined}
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
              <div className="text-center">
                <Link to="/archive">
                  <Button variant="orange" size="lg" className="mr-4">
                    View All Articles
                  </Button>
                </Link>
                <Link to="/newsletter">
                  <Button variant="outline" size="lg">
                    Subscribe on Substack
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-md mx-auto mb-12 bg-card rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-center mb-4">Subscribe to Our Newsletter</h3>
                <iframe 
                  src="https://metapointadvisors.substack.com/embed" 
                  width="100%" 
                  height="320" 
                  style={{ border: '1px solid #EEE', background: 'white' }}
                  frameBorder="0" 
                  scrolling="no"
                  title="Subscribe to The Meta Point"
                ></iframe>
              </div>

              <div className="text-center mb-8">
                <a 
                  href="https://metapointadvisors.substack.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="orange" size="lg" className="mr-4">
                    Read on Substack
                  </Button>
                </a>
                <Link to="/newsletter">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Economic Insights Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Economic Insights</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Marisa Joelson (known as Maya) founded Meta Point Advisors after several years at
                Merrill Lynch in 2017. Maya has two decades of experience advising CEOs, technology
                executives, hedge fund managers, families, and individuals on their investment
                decisions.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Her differentiated ideas have been featured in the Wall Street Journal, Barron's,
                and at the World Economic Forum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/advisors">
                  <Button variant="navy">View Advisory Services</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">Learn More About Maya</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={mayaImage}
                alt="Maya Joelson"
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover object-[center_20%] md:object-[center_15%] border-4 border-white shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Meta Point Advisors is committed to delivering global market insights and thought
            leadership in the realm of investing. We are dedicated to simplifying financial
            complexities and challenging conventional groupthink. With a proven track record of
            staying ahead of the curve, our approach and insights empower individuals and
            organizations to make informed, forward-thinking investment decisions.
          </p>
          <Link to="/about">
            <Button variant="orange" size="lg">
              Learn More About Meta Point
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
