import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import mayaImage from "@/assets/maya.jpg";

const About = () => {
  return (
    <>
      <Hero
        title="About Meta Point Advisors"
        subtitle="Two decades of experience delivering global market insights and thought leadership"
      />

      {/* Main Bio Section */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <img
                src={mayaImage}
                alt="Maya Marisa Joelson"
                className="rounded-full w-64 h-64 object-cover object-[center_15%] border-4 border-navy shadow-xl"
              />
            </div>

            <h2 className="text-3xl font-bold mb-8 text-center">Maya Marisa Joelson</h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Marisa Joelson (known as Maya) founded Meta Point Advisors after several years at
                Merrill Lynch in 2017. Maya has two decades of experience advising CEOs, technology
                executives, hedge fund managers, families, and individuals on their investment
                decisions. Her differentiated ideas have been featured in the Wall Street Journal,
                Barron's, and at the World Economic Forum.
              </p>

              <p>
                Maya worked for the #1 Institutional Investor equity research analyst team on Wall
                Street covering US retail before moving to London where she focused on emerging
                markets. In London, she worked at Renaissance Capital and advised the world's
                leading mutual fund and hedge fund managers, including Goldman Sachs and JP Morgan,
                on their investments in Emerging Europe and Africa.
              </p>

              <p>
                She later became the macroeconomist and financial market advisor to Rio Tinto, the
                second largest mining firm in the world. In this role, she provided global insight
                to the CEO on economies and financial and commodity markets including China, India,
                Japan, Chile, USA, and Europe.
              </p>

              <p>
                While at Harvard in 2004, she wrote the first paper for the World Economic Forum on
                the business case for corporations to advance women and diverse talent. Her paper in
                2004 was presented at Davos to 100 CEOs and spurred the start of WEF highly regarded
                Gender Programme to track how nations fare in capturing the talent of half their
                population. Later, McKinsey, Credit Suisse, UBS and other major corporations
                followed suit to develop research and statistics to show that gender balanced and
                diverse teams lead to better financial performance and reduced groupthink.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Education</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Maya Joelson holds a <strong>MPA from Harvard</strong> and a{" "}
                <strong>MBA from Northwestern (Kellogg)</strong>. She graduated with the prestigious{" "}
                <strong>College of Social Studies major from Wesleyan University</strong>.
              </p>
              <p>
                While at Wesleyan, Maya worked and lived in Russia (Moscow and St. Petersburg)
                during this historic and tumultuous period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Benefit from decades of experience in global markets and investment strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/subscribe">
              <Button variant="orange" size="lg">
                Subscribe to Newsletter
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="navy" size="lg" className="border border-white/20 bg-white/10">
                Contact for Advisory Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
