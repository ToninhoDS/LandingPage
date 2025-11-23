import { useEffect, useMemo, useState } from "react";

const slides = [
  { id: 1, label: "Ambiente Premium", color: "from-amber-500/30" },
  { id: 2, label: "Profissionais", color: "from-amber-400/25" },
  { id: 3, label: "Experiência", color: "from-amber-300/20" },
];

const PhotoCarousel = () => {
  const [idx, setIdx] = useState(0);
  const current = useMemo(() => slides[idx], [idx]);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-48 md:h-64">
      <div className={`absolute inset-0 bg-gradient-to-br ${current.color} via-transparent to-transparent`} />
      <div className="absolute inset-0 grid grid-cols-3 gap-3 p-6">
        <div className="rounded-lg bg-neutral-800" />
        <div className="rounded-lg bg-neutral-800" />
        <div className="rounded-lg bg-neutral-800" />
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="rounded-full bg-black/60 px-3 py-1 text-xs text-white">{current.label}</div>
        <div className="flex gap-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`h-2 w-2 rounded-full ${i === idx ? "bg-amber-500" : "bg-white/40"}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoCarousel;