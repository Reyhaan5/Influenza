import Section from "../common/Section";
import FAQItem from "./FAQItem";
import { faqs } from "../../constants/faq";
import { MessageCircle } from "lucide-react";

function FAQ() {
  return (
    <Section id="faq">
      {/* Heading */}

      <div className="mx-auto max-w-3xl text-center">
        <span
          className="
            inline-flex
            rounded-full
            bg-[var(--color-primary)]/10
            px-5
            py-2
            text-sm
            font-semibold
            text-[var(--color-primary)]
          "
        >
          Frequently Asked Questions
        </span>

        <h2
          className="
            mt-6
            text-4xl
            font-bold
            text-[var(--color-text)]
            lg:text-5xl
          "
        >
          Everything you need to know
        </h2>

        <p
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-lg
            leading-8
            text-[var(--color-text-light)]
          "
        >
          Learn more about how Influenza helps brands discover creators,
          launch campaigns, collaborate with teams and measure performance.
        </p>
      </div>

      {/* FAQ List */}

      <div className="mx-auto mt-16 max-w-4xl space-y-5">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      {/* Bottom CTA */}

      <div
        className="
          mx-auto
          mt-20
          max-w-3xl
          rounded-[32px]
          border
          border-[var(--color-accent)]
          bg-gradient-to-br
          from-white
          via-white
          to-[var(--color-background)]
          p-10
          text-center
          shadow-lg
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-[var(--color-primary)]/10
            text-[var(--color-primary)]
          "
        >
          <MessageCircle size={30} />
        </div>

        <h3
          className="
            mt-6
            text-2xl
            font-bold
            text-[var(--color-text)]
          "
        >
          Still have questions?
        </h3>

        <p
          className="
            mt-4
            leading-7
            text-[var(--color-text-light)]
          "
        >
          Our team is always ready to help you understand the platform,
          discuss your requirements, and guide you through the best solution.
        </p>

        <button
          className="
            mt-8
            rounded-xl
            bg-[var(--color-primary)]
            px-7
            py-3
            font-semibold
            text-white
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          Contact Our Team
        </button>
      </div>
    </Section>
  );
}

export default FAQ;