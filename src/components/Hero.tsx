import { ReactNode } from "react";

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  backgroundImage?: string;
  overlay?: boolean;
}

const Hero = ({ title, subtitle, children, backgroundImage, overlay = true }: HeroProps) => {
  return (
    <section
      className="relative py-24 md:py-32 flex items-center justify-center text-white"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "hsl(var(--navy))" }
      }
    >
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-navy/80"></div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default Hero;
