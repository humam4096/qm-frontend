export const FormSubmissionSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 animate-pulse">

      {/* ================= HEADER ================= */}
      <div className="space-y-4 border-b pb-6">
        <div className="h-8 w-1/2 bg-muted rounded" />
        <div className="h-4 w-1/3 bg-muted rounded" />

        <div className="flex justify-between items-center mt-4">
          <div className="space-y-2">
            <div className="h-3 w-40 bg-muted rounded" />
            <div className="h-3 w-36 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>

          <div className="w-24 h-16 bg-muted rounded-xl" />
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* ================= APPROVAL ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>

      {/* ================= SECTIONS ================= */}
      <div className="space-y-8">
        <div className="h-6 w-1/4 bg-muted rounded" />

        {Array.from({ length: 2 }).map((_, sIndex) => (
          <div key={sIndex} className="space-y-4">

            {/* Section Title */}
            <div className="space-y-2">
              <div className="h-5 w-1/3 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>

            {/* Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, qIndex) => (
                <div
                  key={qIndex}
                  className="p-4 rounded-md bg-muted space-y-3"
                >
                  <div className="h-4 w-3/4 bg-background/60 rounded" />
                  <div className="h-3 w-1/2 bg-background/60 rounded" />
                  <div className="h-3 w-1/3 bg-background/60 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ================= STATUS HISTORY ================= */}
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-muted rounded" />

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between p-3 rounded-md bg-muted"
          >
            <div className="space-y-2">
              <div className="h-3 w-24 bg-background/60 rounded" />
              <div className="h-3 w-32 bg-background/60 rounded" />
            </div>

            <div className="h-3 w-24 bg-background/60 rounded" />
          </div>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="h-3 w-1/3 mx-auto bg-muted rounded" />
    </div>
  );
};