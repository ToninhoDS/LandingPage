const WizardSkeleton = () => {
  return (
    <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6 md:p-8 animate-pulse">
      {/* Progress bar skeleton */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-4 w-20 rounded bg-neutral-800" />
          <div className="h-4 w-8 rounded bg-neutral-800" />
        </div>
        <div className="h-2 w-full rounded bg-neutral-800" />
      </div>

      {/* Content skeleton - varies by step */}
      <div className="min-h-48 md:min-h-56">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-800 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-32 rounded bg-neutral-700" />
                  <div className="h-3 w-20 rounded bg-neutral-700" />
                </div>
                <div className="h-6 w-16 rounded bg-neutral-700" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons skeleton */}
      <div className="mt-8 flex items-center justify-between">
        <div className="h-12 w-24 rounded-xl bg-neutral-800" />
        <div className="h-12 w-24 rounded-xl bg-neutral-800" />
      </div>
    </div>
  );
};

export default WizardSkeleton;