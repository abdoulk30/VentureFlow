export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-20 bg-surfaceMuted rounded" />
        <div className="h-6 w-64 bg-surfaceMuted rounded" />
        <div className="h-3 w-96 max-w-full bg-surfaceMuted rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 bg-cardBg border border-customBorder rounded-xl" />
        <div className="h-64 bg-cardBg border border-customBorder rounded-xl" />
      </div>

      <div className="h-40 bg-cardBg border border-customBorder rounded-xl" />
    </div>
  );
}