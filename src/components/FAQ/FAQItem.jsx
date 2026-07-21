import { useState } from "react";
import { Plus, Minus } from "lucide-react";

function FAQItem({
  question,
  answer,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-[var(--color-accent)]
        bg-white/80
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary)]
        hover:shadow-xl
      "
    >
      {/* Question */}

      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-6
          p-7
          text-left
        "
      >
        <h3
          className="
            text-lg
            font-semibold
            text-[var(--color-text)]
            transition-colors
            duration-300
            group-hover:text-[var(--color-primary)]
          "
        >
          {question}
        </h3>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-[var(--color-primary)]/10
            text-[var(--color-primary)]
            transition-all
            duration-300
            group-hover:scale-110
          "
        >
          {open ? (
            <Minus size={20} />
          ) : (
            <Plus size={20} />
          )}
        </div>
      </button>

      {/* Answer */}

      <div
        className={`
          grid
          transition-all
          duration-500
          ease-in-out
          ${
            open
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="px-7 pb-7">
            <div className="border-t border-[var(--color-accent)] pt-6">
              <p
                className="
                  leading-8
                  text-[var(--color-text-light)]
                "
              >
                {answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQItem;