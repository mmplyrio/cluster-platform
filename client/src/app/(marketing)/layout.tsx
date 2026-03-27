import { HeroHeader } from "@/components/shared/main-nav";
import FooterSection from "@/components/shared/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeroHeader />
      {children}
      <FooterSection />
    </>
  );
}
