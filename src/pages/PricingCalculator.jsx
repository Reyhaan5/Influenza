import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import ReceiptPrinter from "../components/pricing/ReceiptPrinter";

export default function PricingCalculator() {
  return (
    <>
      <Navbar />
      <Section className="pt-40">
        <div className="max-w-xl mx-auto text-center">
          <span className="inline-flex rounded-full bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            Free · No login required
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[var(--color-text)] leading-tight">
            What should you charge?
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-light)]">
            Answer six quick questions and watch your rate card print, right here.
          </p>
        </div>

        <div className="mt-14">
          <ReceiptPrinter />
        </div>
      </Section>
    </>
  );
}