import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Subscribe = () => {
  const benefits = [
    "Weekly global market insights delivered to your inbox",
    "In-depth geopolitical analysis and investment implications",
    "Early warning of emerging market trends",
    "Access to exclusive investment commentary",
    "Actionable takeaways from decades of Wall Street experience",
    "Unfiltered perspective cutting through groupthink",
  ];

  const faqs = [
    {
      question: "How often do you publish?",
      answer:
        "The Meta Point newsletter is published weekly, delivering timely insights on global markets and investment strategy.",
    },
    {
      question: "Is the newsletter free?",
      answer:
        "Yes, the newsletter is currently free for all subscribers. We may introduce premium content in the future.",
    },
    {
      question: "Can I unsubscribe anytime?",
      answer:
        "Absolutely. You can unsubscribe at any time with a single click at the bottom of any newsletter.",
    },
    {
      question: "What topics do you cover?",
      answer:
        "We cover global financial markets, geopolitical developments, macroeconomic trends, investment strategy, and emerging opportunities across asset classes.",
    },
  ];

  return (
    <>
      <Hero
        title="Stay Ahead of the Curve"
        subtitle="Subscribe to The Meta Point for weekly insights that cut through market noise"
      />

      {/* Main Subscribe Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center mb-8">What You'll Get</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-6 h-6 text-orange flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>

              {/* Substack Embed Placeholder */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <h3 className="text-2xl font-bold mb-4">Subscribe to The Meta Point</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your Substack publication to enable subscriptions
                </p>
                <Button variant="orange" size="lg" disabled>
                  Substack Integration Coming Soon
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  In the meantime, contact us at{" "}
                  <a href="mailto:mmjoelson@gmail.com" className="text-orange hover:underline">
                    mmjoelson@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Featured In</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-xl font-semibold text-muted-foreground">
              <div>Wall Street Journal</div>
              <div>Barron's</div>
              <div>World Economic Forum</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Statement */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              We respect your privacy. Your email address will never be shared or sold to third
              parties. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Subscribe;
