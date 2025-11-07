import { useState } from "react";
import Hero from "@/components/Hero";
import NewsletterCard from "@/components/NewsletterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      title: "Year-End Market Review 2023",
      date: "December 30, 2023",
      excerpt:
        "A comprehensive analysis of market performance throughout 2023 and key lessons for investors.",
      category: "Markets",
    },
    {
      title: "Emerging Markets Outlook",
      date: "December 15, 2023",
      excerpt:
        "Examining opportunities in emerging markets as global economic dynamics shift in 2024.",
      category: "Geopolitics",
    },
    {
      title: "Federal Reserve Policy Impact",
      date: "November 28, 2023",
      excerpt:
        "Understanding the implications of recent Fed decisions on interest rates and market liquidity.",
      category: "Economic Policy",
    },
    {
      title: "Technology Sector Analysis",
      date: "November 10, 2023",
      excerpt:
        "Deep dive into technology stocks and the sector's outlook amid changing market conditions.",
      category: "Technology",
    },
    {
      title: "Global Trade Dynamics",
      date: "October 25, 2023",
      excerpt:
        "How shifting trade patterns and geopolitical tensions are reshaping investment strategies.",
      category: "Geopolitics",
    },
    {
      title: "Portfolio Diversification Strategies",
      date: "October 8, 2023",
      excerpt:
        "Practical approaches to building resilient portfolios in uncertain market environments.",
      category: "Markets",
    },
  ];

  const filteredArticles = articles.filter(
    (article) =>
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

      <section className="py-20 bg-light-gray">
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
                Showing {filteredArticles.length} of {articles.length} articles
              </p>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <NewsletterCard key={index} {...article} />
                ))}
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
