import {
    TrendingUp,
    Users,
    IndianRupee,
    BarChart3,
  } from "lucide-react";
  
  function MetricCard({
    title,
    value,
    change,
    className = "",
  }) {
    const positive = change?.startsWith("+");
  
    const icons = {
      Reach: TrendingUp,
      Creators: Users,
      Budget: IndianRupee,
      Engagement: BarChart3,
    };
  
    const Icon = icons[title] || TrendingUp;
  
    return (
      <div
        className={`
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-[var(--color-accent)]
          bg-gradient-to-br
          from-white
          to-[#F8F5FC]
          p-8
          min-h-[170px]
          shadow-md
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          ${className}
        `}
      >
        {/* Glow */}
        <div
          className="
            absolute
            -top-10
            -right-10
            h-28
            w-28
            rounded-full
            bg-[#8B5FBF]/10
            blur-2xl
          "
        />
  
        <div className="relative z-10 flex h-full flex-col justify-between">
  
          {/* Icon */}
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-[#8B5FBF]
              to-[#61398F]
              text-white
              shadow-lg
              transition-transform
              duration-300
              group-hover:scale-110
            "
          >
            <Icon size={24} />
          </div>
  
          {/* Title */}
          <div className="mt-6">
            <p className="text-sm font-medium text-[var(--color-text-light)]">
              {title}
            </p>
  
            <h3 className="mt-2 text-4xl font-bold text-[var(--color-text)]">
              {value}
            </h3>
          </div>
  
          {/* Change */}
          {change && (
            <div
              className={`
                mt-5
                inline-flex
                w-fit
                rounded-full
                px-3
                py-1
                text-sm
                font-semibold
                ${
                  positive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {change}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default MetricCard;