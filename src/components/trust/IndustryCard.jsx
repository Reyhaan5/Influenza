function IndustryCard({ icon, title }) {
    return (
      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-white
          border
          border-[var(--color-accent)]
          px-6
          py-4
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-lg
        "
      >
        <span className="text-2xl">{icon}</span>
  
        <span className="font-semibold text-[var(--color-text)]">
          {title}
        </span>
      </div>
    );
  }
  
  export default IndustryCard;