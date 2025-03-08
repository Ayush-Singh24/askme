export default function SkeletonLoading() {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {[...Array(4)].map((_, j) => (
          <div key={j} className="p-2 border rounded">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
