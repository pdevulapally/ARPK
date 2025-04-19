import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 bg-gray-800" />
        <Skeleton className="h-4 w-96 mt-2 bg-gray-800" />
      </div>

      <div className="h-12 bg-gray-900 border border-gray-800 rounded-md flex">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-full flex-1 rounded-none bg-gray-800" />
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-gray-800" />
          <Skeleton className="h-4 w-72 mt-2 bg-gray-800" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-800" />
              <Skeleton className="h-10 w-full bg-gray-800" />
            </div>
          ))}

          <div className="flex justify-end space-x-4 pt-4">
            <Skeleton className="h-10 w-24 bg-gray-800" />
            <Skeleton className="h-10 w-32 bg-gray-800" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
