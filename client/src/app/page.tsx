import HeroSection from "@/components/marketing/hero";
import TurnSection from "@/components/marketing/section1";
import AboutUsSection from "@/components/marketing/section2";
import VentureSection from "@/components/marketing/venture";
import MethodologySection from "@/components/marketing/metodos";
import ConsultingSection from "@/components/marketing/consulting";
import TeamSection from "@/components/marketing/team";
import CTASection from "@/components/marketing/cta";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cluster | Inovação e Tecnologia',
  description: 'Cluster | Inovação e Tecnologia',
  icons: {
    icon: '/logomarca.svg', // Opcional se você já colocou na raiz
  },
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <TurnSection />
      <AboutUsSection />
      <VentureSection />
      <MethodologySection />
      <ConsultingSection />
      <TeamSection />
      <CTASection />

    </div>
  );
}
