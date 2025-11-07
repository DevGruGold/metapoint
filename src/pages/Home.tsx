import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import NewsletterCard from "@/components/NewsletterCard";
import { Button } from "@/components/ui/button";
import mayaImage from "@/assets/maya.jpg";

const Home = () => {
  const featuredInsights = [
    {
      title: "Navigating Global Market Volatility",
      date: "January 2024",
      excerpt: "Understanding the key drivers of market uncertainty and how to position portfolios for resilience in turbulent times.",
    },
    {
      title: "Emerging Markets in a Changing World",
      date: "December 2023",
      excerpt: "An analysis of opportunity and risk in emerging economies as geopolitical dynamics reshape global trade patterns.",
    },
    {
      title: "Technology's Impact on Investment Strategy",
      date: "November 2023",
      excerpt: "How technological innovation is transforming traditional investment approaches and creating new opportunities.",
    },
  ];

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
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Latest Insights from The Meta Point
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredInsights.map((insight, index) => (
              <NewsletterCard key={index} {...insight} link="/newsletter" />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/newsletter">
              <Button variant="orange">View All Newsletter Articles</Button>
            </Link>
          </div>
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
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-4 border-white shadow-xl"
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
