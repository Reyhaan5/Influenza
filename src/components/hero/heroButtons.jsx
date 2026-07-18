import { ArrowRight, Calendar } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";
function HeroButtons() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">

<Link to="/signup">
    <Button
        className="
          bg-gradient-to-r
          from-[#8B5FBF]
          to-[#61398F]
          text-white
          px-7
          py-3.5
          shadow-lg
          hover:shadow-xl
        "
      >
        Get Started
        <ArrowRight size={18} className="ml-2" />
      </Button>
</Link>

      <Button
        variant="secondary"
        className="px-7 py-3.5"
      >
        <Calendar size={18} className="mr-2" />
        See how it works
      </Button>

    </div>
  );
}

export default HeroButtons;