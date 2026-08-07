import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

export function ShiftingDropDown({ tabs = [], className = "" }) {
  return <Tabs tabs={tabs} className={className} />;
}

const Tabs = ({ tabs, className }) => {
  const [selected, setSelected] = useState(null); // 1-based index into `tabs`
  const [dir, setDir] = useState(null);

  const handleSetSelected = (val) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }
    setSelected(val);
  };

  const activeTab =
    typeof selected === "number" ? tabs[selected - 1] : null;

  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className={`relative flex h-fit items-center gap-1 ${className}`}
    >
      {tabs.map((tab, idx) => {
        const internalId = idx + 1;

        if (!tab.columns) {
          return (
            <PlainNavLink key={tab.id} href={tab.href} isRoute={tab.isRoute}>
              {tab.title}
            </PlainNavLink>
          );
        }

        return (
          <Tab
            key={tab.id}
            tab={internalId}
            selected={selected}
            handleSetSelected={handleSetSelected}
          >
            {tab.title}
          </Tab>
        );
      })}

      <AnimatePresence>
        {activeTab?.columns && (
          <Content tab={activeTab} activeId={selected} dir={dir} />
        )}
      </AnimatePresence>
    </div>
  );
};

const PlainNavLink = ({ children, href = "#", isRoute }) => {
  const className =
    "rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--color-text-light)] transition-colors duration-200 hover:bg-[var(--color-background)]/60 hover:text-[var(--color-text)]";
  return isRoute ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

const Tab = ({ children, tab, handleSetSelected, selected }) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={`
        flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40
        ${
          selected === tab
            ? "bg-[var(--color-background)] text-[var(--color-text)] shadow-sm"
            : "text-[var(--color-text-light)] hover:bg-[var(--color-background)]/60 hover:text-[var(--color-text)]"
        }
      `}
    >
      <span>{children}</span>
      <ChevronDown
        size={15}
        className={`text-[var(--color-text-light)] transition-transform duration-200 ${
          selected === tab ? "rotate-180 text-[var(--color-primary)]" : ""
        }`}
      />
    </button>
  );
};

  const Content = ({ tab, activeId, dir }) => {
  const columnCount = tab.columns.length;
  const widthClass =
    columnCount >= 3 ? "w-[44rem]" : columnCount === 2 ? "w-[30rem]" : "w-72";

  const [leftOffset, setLeftOffset] = useState(0);

  useEffect(() => {
    if (!activeId) return;
    const hoveredTab = document.getElementById(`shift-tab-${activeId}`);
    if (!hoveredTab) return;

    const parent = hoveredTab.parentElement;
    if (!parent) return;

    const tabRect = hoveredTab.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const tabCenter = tabRect.left + tabRect.width / 2 - parentRect.left;
    const approxWidth = columnCount >= 3 ? 704 : columnCount === 2 ? 480 : 288;
    
    let calculatedLeft = tabCenter - approxWidth / 2;
    if (calculatedLeft < 0) calculatedLeft = 0;

    setLeftOffset(calculatedLeft);
  }, [activeId, columnCount]);

  return (
    <motion.div
      id="overlay-content"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, left: leftOffset }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      /* Notice: `top-full pt-3` keeps the wrapper attached directly to the header */
      className={`absolute top-full pt-3 ${widthClass} max-w-[92vw] z-50`}
    >
      {/* Invisible bridge overlay spanning the padding gap */}
      <Bridge />

      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-2xl">
        <Nub tabId={activeId} />

        <motion.div
          key={tab.id}
          initial={{ opacity: 0, x: dir === "l" ? 30 : dir === "r" ? -30 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex divide-x divide-[var(--color-border)]"
        >
          {tab.columns.map((col, i) => (
            <MenuColumn key={col.heading ?? i} heading={col.heading} items={col.items} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const MenuColumn = ({ heading, items }) => (
  <div className="min-w-[210px] flex-1 px-5 py-5">
    {heading && (
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-light)]">
        {heading}
      </p>
    )}
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <MenuItem key={item.title} {...item} />
      ))}
    </div>
  </div>
);

const MenuItem = ({ imageSrc, icon: Icon, emoji, title, description, href = "#", isRoute }) => {
  const inner = (
    <>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className="mt-0.5 h-6 w-6 flex-shrink-0 object-contain"
        />
      ) : Icon ? (
        <Icon size={20} className="mt-0.5 flex-shrink-0 text-[var(--color-primary)]" />
      ) : (
        <span className="mt-0.5 text-lg flex-shrink-0">{emoji}</span>
      )}

      <span>
        <span className="block text-sm font-semibold text-[var(--color-text)]">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-xs leading-snug text-[var(--color-text-light)]">
            {description}
          </span>
        )}
      </span>
    </>
  );

  const className =
    "group -mx-2.5 flex items-start gap-3 rounded-xl p-2.5 transition-colors duration-150 hover:bg-[var(--color-background)]";

  return isRoute ? (
    <Link to={href} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={className}>
      {inner}
    </a>
  );
};

const Bridge = () => (
  <div className="absolute top-0 left-0 right-0 h-3" />
);

const Nub = ({ tabId }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
  }, [tabId]);

  const moveNub = () => {
    if (!tabId) return;
    const hoveredTab = document.getElementById(`shift-tab-${tabId}`);
    const overlayContent = document.getElementById("overlay-content");
    if (!hoveredTab || !overlayContent) return;

    const tabRect = hoveredTab.getBoundingClientRect();
    const { left: contentLeft } = overlayContent.getBoundingClientRect();
    setLeft(tabRect.left + tabRect.width / 2 - contentLeft);
  };

  return (
    <motion.span
      style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)" }}
      animate={{ left }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
    />
  );
};

export default ShiftingDropDown;