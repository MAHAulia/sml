"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, BoxIcon, MoreHorizontal, PlusCircle, SearchIcon, Trash2Icon } from "lucide-react"
// import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge } from "@/components/status-badge"
import { DeliveryOrderData } from "@/types/delivery-order"

type ColumnProps = {
  onView: (data: DeliveryOrderData) => void;
  onEdit: (data: DeliveryOrderData) => void;
  onDelete: (data: DeliveryOrderData) => void;
  onTutupManifest: (data: DeliveryOrderData) => void;
};

export const deliveryOrderTableColumns = ({ onView, onEdit, onDelete, onTutupManifest }: ColumnProps): ColumnDef<DeliveryOrderData>[] => [
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onView(data)}
            >
              <SearchIcon /> Lihat
            </DropdownMenuItem>
            
            {(data.status === "created") && <DropdownMenuItem
              onClick={() => onEdit(data)}
            >
              <PlusCircle /> Tambah Item Delivery
            </DropdownMenuItem>}
            {(data.items.length != 0 && data.status == 'created') && <DropdownMenuItem
              onClick={() => onTutupManifest(data)}
            >
              <BoxIcon /> Tutup Manifest
            </DropdownMenuItem>}
            {data.status !== "created" && data.items.length > 0 ? null : <DropdownMenuSeparator />}
            {data.status !== "created" ? null : <DropdownMenuItem className="text-red-500" onClick={() => onDelete(data)}><Trash2Icon className="text-red-500" /> Hapus</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    id: "no",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No.
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const index = row.index + 1;
      return <div className="text-center">{index}</div>
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.original
      return <div className="text-center">
        <StatusBadge status={data.status} />
      </div>
    }
  },
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. DO
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  }
]
