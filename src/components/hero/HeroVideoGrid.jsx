import React from "react";
import HeroVideoTile from "./HeroVideoTile";
import { heroVideos } from "../../constants/heroVideos";

export default function HeroVideoGrid() {
  return (
    <div className="relative">
      {/* Mobile / tablet: horizontal snap-scroll track */}
      <div
        className="
          flex gap-4 overflow-x-auto pb-4 lg:hidden
          snap-x snap-mandatory
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {heroVideos.map((video) => (
          <div key={video.id} className="snap-start">
            <HeroVideoTile video={video} />
          </div>
        ))}
      </div>

      {/* Desktop: staggered bento columns */}
      <div className="hidden lg:flex items-start gap-4">
        <div className="flex flex-col gap-4 pt-10">
          <HeroVideoTile video={heroVideos[1]} />
          <HeroVideoTile video={heroVideos[2]} />
        </div>
        <div className="flex flex-col gap-4">
          <HeroVideoTile video={heroVideos[0]} />
        </div>
        <div className="flex flex-col gap-4 pt-16">
          <HeroVideoTile video={heroVideos[3]} />
          <HeroVideoTile video={heroVideos[4]} />
        </div>
      </div>
    </div>
  );
}
