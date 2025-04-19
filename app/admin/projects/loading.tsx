export default function Loading() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-32 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-800 rounded animate-pulse mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-gray-800 rounded animate-pulse"></div>
        </div>
  
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
  
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded animate-pulse"></div>
            ))}
        </div>
      </div>
    )
  }
  