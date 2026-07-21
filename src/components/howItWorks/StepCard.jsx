function StepCard({
    icon: Icon,
    title,
    description,
  }) {
    return (
      <div
        className="
          group
          relative
          rounded-3xl
          border
          border-[var(--color-accent)]
          bg-white
          p-8
          transition-all
          duration-300
          hover:-translate-y-2
          hover:shadow-2xl
        "
      >
        {/* Icon */}
  
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-[var(--color-primary)]
            text-white
          "
        >
          <Icon size={30} />
        </div>
  
        {/* Title */}
  
        <h3 className="mt-8 text-2xl font-bold text-[var(--color-text)]">
          {title}
        </h3>
  
        {/* Description */}
  
        <p className="mt-4 leading-7 text-[var(--color-text-light)]">
          {description}
        </p>
  
        {/* Hover Line */}
  
        <div
          className="
            absolute
            left-0
            bottom-0
            h-1
            w-0
            rounded-full
            bg-[var(--color-primary)]
            transition-all
            duration-300
            group-hover:w-full
          "
        />
      </div>
    );
  }
  
  export default StepCard;