import { useMemo } from "react";

type Props = {
  startHour?: number;
  endHour?: number;
  stepMinutes?: number;
  selected?: string;
  onSelect?: (value: string) => void;
};

const HoursCarousel = ({ startHour = 9, endHour = 12, stepMinutes = 30, selected, onSelect }: Props) => {
  const slots = useMemo(() => {
    const res: string[] = [];
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += stepMinutes) {
        const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        res.push(label);
      }
    }
    return res;
  }, [startHour, endHour, stepMinutes]);

  return (
    <div className="mt-4 overflow-x-auto pb-2">
      <div className="flex gap-2">
        {slots.map((time) => {
          const active = time === selected;
          return (
            <button
              key={time}
              onClick={() => onSelect && onSelect(time)}
              className={`rounded-md px-4 py-2 text-sm transition ${active ? "bg-amber-500 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HoursCarousel;