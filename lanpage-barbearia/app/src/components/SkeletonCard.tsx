const SkeletonCard = () => {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 animate-pulse">
      <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-neutral-800" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-neutral-800" />
        <div className="h-3 w-full rounded bg-neutral-800" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="h-3 w-12 rounded bg-neutral-800" />
            <div className="h-3 w-12 rounded bg-neutral-800" />
          </div>
          <div className="h-6 w-16 rounded bg-neutral-800" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;