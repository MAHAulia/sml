"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit3, MoreHorizontal, SearchIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Checkbox } from "@/components/ui/checkbox"
import { Offerings } from "@/types/marketing"

type ColumnProps = {
  onView: (data: Offerings) => void;
  onEdit: (data: Offerings) => void;
  onDelete: (data: Offerings) => void;
  onSetTarif: (data: Offerings) => void;
};

export const offeringTableColumn = ({ onView, onEdit, onDelete, onSetTarif }: ColumnProps): ColumnDef<Offerings>[] => [
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
            {data.status === "pending" && <DropdownMenuItem
              onClick={() => onEdit(data)}
            >
              <Edit3 /> Ubah
            </DropdownMenuItem>}
            {(data.status === "price_set" || data.status === "rejected") && <DropdownMenuItem
              onClick={() => onSetTarif(data)}
            >
              <Edit3 /> Set Tarif
            </DropdownMenuItem>}
            {(data.status === "accepted") && <DropdownMenuItem
              onClick={() => onSetTarif(data)}
            >
              <Edit3 /> Request Pickup
            </DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={() => onDelete(data)}><Trash2Icon className="text-red-500" /> Hapus</DropdownMenuItem>
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
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "senderName",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Pengirim
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "senderAddress",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alamat Pengirim
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "receiverName",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Penerima
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "receiverAddress",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alamat Penerima
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
]
