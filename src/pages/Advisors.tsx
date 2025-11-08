import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp, Globe, Users, BarChart3, Lightbulb, Shield } from "lucide-react";

const Advisors = () => {
  const services = [
    {
      icon: <TrendingUp className="w-8 h-8 text-orange" />,
      title: "Investment Strategy Consultation",
      description:
        "Personalized investment strategies tailored to your financial goals and risk tolerance, backed by decades of market expertise.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange" />,
      title: "Portfolio Management & Analysis",
      description:
        "Comprehensive portfolio review and optimization to maximize returns while managing risk in dynamic market conditions.",
    },
    {
      icon: <Globe className="w-8 h-8 text-orange" />,
      title: "Global Market Intelligence",
      description:
        "Deep insights into global financial markets, emerging trends, and cross-border investment opportunities.",
    },
    {
      icon: <Shield className="w-8 h-8 text-orange" />,
      title: "Geopolitical Risk Assessment",
      description:
        "Expert analysis of how geopolitical events and policy changes impact your investment portfolio and strategy.",
    },
    {
      icon: <Users className="w-8 h-8 text-orange" />,
      title: "Executive & CEO Advisory",
      description:
        "Strategic financial advisory for technology executives, CEOs, and business leaders navigating complex market environments.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-orange" />,
      title: "Family Office Services",
      description:
        "Customized wealth management and investment guidance for families seeking long-term financial security and growth.",
    },
  ];

  return (
    <>
      <Hero
        title="Advisory Services"
        subtitle="Professional financial and geopolitical advisory backed by two decades of Wall Street experience"
      />

      {/* Services Section */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Services We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4">{service.icon}</div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Approach</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                At Meta Point Advisors, we pride ourselves on delivering{" "}
                <strong>differentiated investment ideas</strong> that cut through market noise and
                conventional groupthink. Our insights are grounded in rigorous analysis of global
                economic trends, geopolitical developments, and market dynamics.
              </p>
              <p>
                We have a proven track record of being <strong>ahead of the curve</strong>. Our
                prescient analysis has included early recognition of major market-moving events,
                such as identifying COVID-19 as a Black Swan event before most analysts recognized
                its global impact.
              </p>
              <p>
                Our methodology combines macroeconomic analysis, sector-specific research, and
                geopolitical intelligence to provide clients with actionable insights that drive
                informed investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Publications Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Publications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Wall Street Journal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Market analysis and investment insights featured in one of the world's leading
                    financial publications.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Barron's</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Expert commentary on global markets and investment strategy in this premier
                    financial magazine.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>World Economic Forum</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Thought leadership on diversity in business and global economic trends presented
                    at Davos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Video Talks Placeholder */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Video Talks & Presentations</h2>
            <div className="bg-white rounded-lg p-12 text-center shadow-md">
              <p className="text-muted-foreground mb-4">
                Video content showcasing presentations, interviews, and market commentary.
              </p>
              <p className="text-sm text-muted-foreground">
                Video gallery coming soon - contact us for speaking engagement inquiries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Work Together?</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Contact us to discuss how Meta Point Advisors can help you navigate global markets and
            achieve your investment goals.
          </p>
          <Link to="/contact">
            <Button variant="orange" size="lg" className="px-12">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Advisors;
