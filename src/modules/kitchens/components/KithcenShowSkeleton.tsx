import React from "react";

export const KitchenShowSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
      
      {/* 🔥 Hero Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-muted/40">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-muted" />

          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="flex gap-3">
              <div className="h-5 w-20 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* 📊 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-xl bg-muted/40 space-y-3">
            <div className="w-8 h-8 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-5 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* 📇 Contact Info */}
      <div className="p-6 rounded-xl bg-muted/40 grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 🏭 Capacity & Storage */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 rounded-xl bg-muted/40 space-y-4">
            <div className="h-5 w-32 bg-muted rounded" />

            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex justify-between items-center p-3 rounded bg-muted">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 🚚 Operations */}
      <div className="p-6 rounded-xl bg-muted/40 space-y-4">
        <div className="h-5 w-40 bg-muted rounded" />

        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded bg-muted">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-muted rounded" />
                <div className="h-4 w-28 bg-muted rounded" />
              </div>
              <div className="h-4 w-10 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 📍 Coordinates */}
      <div className="p-6 rounded-xl bg-muted/40 flex items-center gap-4">
        <div className="w-6 h-6 bg-muted rounded" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
};