import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 bg-gray-800" />
        <Skeleton className="h-10 w-32 bg-gray-800" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-900 p-4 rounded-lg">
        <Skeleton className="h-10 w-full md:w-64 bg-gray-800" />

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Skeleton className="h-10 w-full sm:w-[150px] bg-gray-800" />
          <Skeleton className="h-10 w-full sm:w-[150px] bg-gray-800" />
          <Skeleton className="h-10 w-full sm:w-[100px] bg-gray-800" />
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Role</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Subscription</TableHead>
              <TableHead className="text-gray-400">Joined</TableHead>
              <TableHead className="text-gray-400">Projects</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="border-gray-800">
                {Array.from({ length: 8 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-5 bg-gray-800 rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
