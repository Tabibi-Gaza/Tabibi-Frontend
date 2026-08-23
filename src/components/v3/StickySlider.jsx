import React, { useRef, useEffect, useState } from "react";

function StickySlider({ title, subtitle, items, renderItem, pinHeight = "350vh" }) {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const itemsPerView = 1.2;
  const totalItems = items.length;
  const visibleCount = Math.ceil(itemsPerView);
  const totalSlides = totalItems - visibleCount + 1;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      setProgress(p);

      const targetIndex = Math.round(p * (totalSlides - 1));
      setCurrentIndex(Math.max(0, Math.min(totalSlides - 1, targetIndex)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items.length, totalSlides]);

  const goToSlide = (index) => {
    const clamped = Math.max(0, Math.min(totalSlides - 1, index));
    setCurrentIndex(clamped);

    if (containerRef.current) {
      const container = containerRef.current;
      const scrollable = container.offsetHeight - window.innerHeight;
      const targetProgress = totalSlides > 1 ? clamped / (totalSlides - 1) : 0;
      window.scrollTo({
        top: container.offsetTop + targetProgress * scrollable,
        behavior: "smooth",
      });
    }
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  return (
    <section className="relative">
      <div ref={containerRef} className="w-full" style={{ height: pinHeight }}>
        <div className="sticky top-0 h-screen w-full bg-white flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8">
            <div className="text-center max-w-3xl mb-10">
              <span className="text-xs font-black text-[#138C9F] bg-[#138C9F]/10 px-4 py-2 rounded-full inline-block tracking-wide font-['Tajawal'] mb-4">
                {title}
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 font-['Tajawal'] leading-tight">
                {subtitle}
              </h2>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4">
              <div className="relative">
                <div
                  className="flex gap-5 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  }}
                >
                  {items.map((item, i) => (
                    <div key={i} className="flex-shrink-0 w-full sm:w-[calc(100%/1.2)]">
                      {renderItem(item, i, i === currentIndex)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentIndex ? "w-10 bg-[#138C9F]" : "w-2 bg-slate-200 hover:bg-slate-300"
                    }`}
                    aria-label={`الانتقال للشريحة ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-600 font-extrabold hover:bg-[#138C9F] hover:text-white transition-all duration-300 ${
                    currentIndex === 0 ? "opacity-30 pointer-events-none" : ""
                  }`}
                  aria-label="السابق"
                >
                  →
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= totalSlides - 1}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-600 font-extrabold hover:bg-[#138C9F] hover:text-white transition-all duration-300 ${
                    currentIndex >= totalSlides - 1 ? "opacity-30 pointer-events-none" : ""
                  }`}
                  aria-label="التالي"
                >
                  ←
                </button>
              </div>
            </div>
          </div>

          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-[#138C9F] transition-all duration-100 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StickySlider;