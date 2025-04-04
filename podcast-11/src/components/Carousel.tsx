import React, { useRef } from "react";
import { Preview } from "../types/index";
import ShowCard from "./ShowCard"; // Reusing ShowCard for individual show display

interface CarouselProps {
  shows: Preview[]; // Shows data passed from the parent (homepage)
}

const Carousel: React.FC<CarouselProps> = ({ shows }) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <div className="flex overflow-x-scroll space-x-4 scrollbar-hide" ref={carouselRef}>
        {shows.map((show) => (
          <div key={show.id} className="flex-shrink-0 w-60">
            <ShowCard show={show} />
          </div>
        ))}
      </div>

      {/* Carousel Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
