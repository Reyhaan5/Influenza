import HeroBadge from "./HeroBadge";

function HeroContent() {
  return (
    <div className="max-w-2xl">

      <HeroBadge />

      <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-text)]">
  Find the Right Creators.
  <br />
  <span className="text-[var(--color-primary)]">
    Build Better Campaigns.
  </span>
</h1>

      <p className="mt-8 text-lg leading-8 text-[#4A4A4A]/80">
        Influenza helps brands discover, evaluate and collaborate with
        creators through audience intelligence, pricing intelligence and
        campaign matching—making every partnership more relevant,
        measurable and effective.
      </p>

    </div>
  );
}

export default HeroContent;