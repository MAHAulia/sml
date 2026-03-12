export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    variant: "secondary",
  },
  on_review: {
    label: "On Review",
    variant: "default",
  },
  price_set: {
    label: "Price Set",
    variant: "outline",
  },
  on_nego: {
    label: "On Negotiation",
    variant: "secondary",
  },
  on_review_nego: {
    label: "Review Negotiation",
    variant: "default",
  },
  accepted: {
    label: "Accepted",
    variant: "success",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
  },
  request: {
    label: "Requested",
    variant: "default",
  },
  on_pickup: {
    label: "On Pickup",
    variant: "secondary",
  },
  success_pickup: {
    label: "Success",
    variant: "success",
  },
  failed_pickup: {
    label: "Failed",
    variant: "destructive",
  },
  null: {
    label: "Need Pickup",
    variant: "secondary",
  }
} as const

export function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? {
    label: status,
    variant: "secondary",
  }
}