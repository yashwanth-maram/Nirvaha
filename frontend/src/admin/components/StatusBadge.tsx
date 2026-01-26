import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "companion" | "booking" | "user" | "default";
  className?: string;
}

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (variant) {
      case "companion":
        switch (status.toLowerCase()) {
          case "pending":
            return { label: "Pending", className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" };
          case "approved":
            return { label: "Approved", className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" };
          case "rejected":
            return { label: "Rejected", className: "bg-red-500/20 text-red-300 border-red-500/50" };
          case "suspended":
            return { label: "Suspended", className: "bg-orange-500/20 text-orange-300 border-orange-500/50" };
          default:
            return { label: status, className: "bg-gray-500/20 text-gray-300 border-gray-500/50" };
        }
      case "booking":
        switch (status.toLowerCase()) {
          case "upcoming":
            return { label: "Upcoming", className: "bg-blue-500/20 text-blue-300 border-blue-500/50" };
          case "completed":
            return { label: "Completed", className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" };
          case "cancelled":
            return { label: "Cancelled", className: "bg-red-500/20 text-red-300 border-red-500/50" };
          case "in-progress":
            return { label: "In Progress", className: "bg-teal-500/20 text-teal-300 border-teal-500/50" };
          default:
            return { label: status, className: "bg-gray-500/20 text-gray-300 border-gray-500/50" };
        }
      case "user":
        switch (status.toLowerCase()) {
          case "active":
            return { label: "Active", className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" };
          case "suspended":
            return { label: "Suspended", className: "bg-orange-500/20 text-orange-300 border-orange-500/50" };
          case "banned":
            return { label: "Banned", className: "bg-red-500/20 text-red-300 border-red-500/50" };
          case "pending":
            return { label: "Pending", className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" };
          default:
            return { label: status, className: "bg-gray-500/20 text-gray-300 border-gray-500/50" };
        }
      default:
        return { label: status, className: "bg-gray-500/20 text-gray-300 border-gray-500/50" };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium capitalize",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}


