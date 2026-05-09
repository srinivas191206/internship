import { ArrowRight, Clock, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

export function Hero() {
  const ref = useReveal<HTMLDivElement>();

  const scrollToForm = () => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative px-6 pt-28 pb-24 sm:pt-36 sm:pb-32">
      <div ref={ref} className="reveal mx-auto max-w-4xl text-center">
        <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Now accepting applications
        </div>

        <h1 className="font-display mt-8 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <span className="text-gradient">Internship Opportunity</span>
          <br />
          <span className="text-gradient-primary">for Skilled Builders</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          We're looking for passionate, highly motivated students interested in working
          on real-world projects in Machine Learning, Automation, Website Development, and IoT.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={scrollToForm}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-[1.03] hover:brightness-110 active:scale-100"
          >
            <span className="relative z-10">Apply Now</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
          <a
            href="#details"
            className="rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            Learn more
          </a>
        </div>

        <div id="details" className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, label: "Duration", value: "3 Months" },
            { icon: Sparkles, label: "Stipend", value: "Unpaid" },
            { icon: MapPin, label: "Preferred Location", value: "Vizag" },
          ].map((item) => (
            <div
              key={item.label}
              className="glass group rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <item.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className="font-display mt-1 text-xl font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="glass mx-auto mt-6 inline-flex max-w-2xl items-center gap-2.5 rounded-full px-5 py-2.5 text-xs text-muted-foreground sm:text-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          Company details will be shared with shortlisted candidates only.
        </div>
      </div>
    </section>
  );
}
