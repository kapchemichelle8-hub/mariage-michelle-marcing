import { useEffect } from "react";
import { CountdownSection } from "@/components/CountdownSection";
import { GiftsSection } from "@/components/GiftsSection";
import { GuestbookSection } from "@/components/GuestbookSection";
import { HeroSection } from "@/components/HeroSection";
import { LoveStorySection } from "@/components/LoveStorySection";
import { HeartClipDefs } from "@/components/Ornaments";
import { RsvpFormSection } from "@/components/RsvpFormSection";
import { ScheduleAndDetailsSection } from "@/components/ScheduleAndDetailsSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { VideoSection } from "@/components/VideoSection";

export default function Home() {
  useEffect(() => {
    document.title = "Michelle & Marcing — 26 décembre 2026, Bandjoun";
    // Arrivée depuis un lien « /#rsvp » : on descend à la bonne section.
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, []);

  return (
    <>
      <HeartClipDefs />
      <SiteHeader />
      <main>
        <HeroSection />
        <CountdownSection />
        <LoveStorySection />
        <ScheduleAndDetailsSection />
        <VideoSection />
        <GiftsSection />
        <GuestbookSection />
        <RsvpFormSection />
      </main>
      <SiteFooter />
    </>
  );
}
