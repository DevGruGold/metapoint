import Hero from "@/components/Hero";
import NewsletterCard from "@/components/NewsletterCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Newsletter = () => {
  const sampleArticles = [
    {
      title: "Market Trends for Q1 2024",
      date: "January 15, 2024",
      excerpt:
        "An in-depth analysis of emerging market trends and their implications for investors in the first quarter.",
    },
    {
      title: "Geopolitical Risk Assessment",
      date: "January 8, 2024",
      excerpt:
        "Understanding how current geopolitical tensions impact global financial markets and investment strategies.",
    },
    {
      title: "Technology Sector Outlook",
      date: "December 28, 2023",
      excerpt:
        "Examining the technology sector's performance and identifying key opportunities for the year ahead.",
    },
    {
      title: "Central Bank Policy Updates",
      date: "December 20, 2023",
      excerpt:
        "Analysis of recent central bank decisions and their effects on interest rates and market liquidity.",
    },
  ];

  return (
    <>
      <Hero
        title="The Meta Point Newsletter"
        subtitle="Stay informed with weekly insights on global financial markets, geopolitical analysis, and investment strategy"
      />

      {/* Introduction Section */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">What You'll Receive</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The Meta Point newsletter delivers cutting-edge analysis on global financial markets,
              geopolitical developments, and investment opportunities. Each issue provides actionable
              insights designed to help you stay ahead of the curve.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-lg mb-2">Market Analysis</h3>
                <p className="text-muted-foreground">
                  In-depth examination of global market trends and emerging opportunities
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Geopolitical Insights</h3>
                <p className="text-muted-foreground">
                  Understanding how world events impact investment strategies
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Economic Commentary</h3>
                <p className="text-muted-foreground">
                  Expert perspective on monetary policy and economic indicators
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <Link to="/subscribe">
              <Button variant="orange" size="lg" className="px-12">
                Subscribe Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Substack Feed */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Recent Articles</h2>
            
            {/* Substack Subscription Widget */}
            <div className="bg-white rounded-lg p-8 shadow-md mb-12">
              <h3 className="text-xl font-semibold text-center mb-6">Subscribe to The Meta Point</h3>
              <div className="max-w-md mx-auto">
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
            </div>

            {/* Link to Full Publication */}
            <div className="text-center mb-12">
              <p className="text-muted-foreground mb-4">
                Read all articles on Substack
              </p>
              <a 
                href="https://metapointadvisors.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="orange">Visit The Meta Point on Substack</Button>
              </a>
            </div>

            <div className="text-center mt-12">
              <Link to="/archive">
                <Button variant="outline">View Full Archive</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Info */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Newsletter Details</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                <strong>Frequency:</strong> Weekly insights delivered to your inbox
              </p>
              <p>
                <strong>Format:</strong> In-depth analysis with actionable takeaways
              </p>
              <p>
                <strong>Topics:</strong> Global markets, geopolitics, investment strategy, economic
                trends
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;
