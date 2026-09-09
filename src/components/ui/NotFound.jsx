import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
      {/* 404 Number */}
      <h1 className="text-[120px] font-extrabold leading-none tracking-tight text-[var(--color-primary)]/15 md:text-[180px]">
        404
      </h1>

      <h2 className="-mt-6 text-3xl font-bold text-[var(--color-text)] md:text-4xl">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-lg text-[var(--color-text-light)]">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
        >
          <Home size={18} />
          Back to Home
        </Link>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
}

export default NotFound;
