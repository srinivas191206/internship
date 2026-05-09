import { createFileRoute } from "@tanstack/react-router";
import { BackgroundFX } from "@/components/background-fx";
import { Hero } from "@/components/hero";
import { ApplicationForm } from "@/components/application-form";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen">
      <BackgroundFX />
      <Hero />
      <ApplicationForm />
      <SiteFooter />
    </main>
  );
}
