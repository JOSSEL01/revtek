export function TableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Cabecera falsa */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-4 py-3 gap-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
      
      {/* Filas falsas */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex px-4 py-4 gap-4 border-b border-slate-100">
          <div className="flex items-center gap-3 w-1/3">
            <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center w-1/3">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center w-1/4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}