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
import { ArrowUpDown, BoxIcon, MoreHorizontal, SearchIcon, Trash2Icon } from "lucide-react"
// import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge } from "@/components/status-badge"
import { InvoiceData } from "@/types/invoice"

type ColumnProps = {
  onView: (data: InvoiceData) => void;
  onEdit: (data: InvoiceData) => void;
  onDelete: (data: InvoiceData) => void;
  onTutupManifest: (data: InvoiceData) => void;
};

export const manifestTerimaTableColumns = ({ onView, onEdit, onDelete }: ColumnProps): ColumnDef<InvoiceData>[] => [
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
            {(data.status == "pending") && <DropdownMenuItem
              onClick={() => onEdit(data)}
            > 
              <BoxIcon /> Tambah Item Invoice
            </DropdownMenuItem>}
            {data.status == "pending" && <DropdownMenuSeparator />}
            {data.status == "pending" && <DropdownMenuItem className="text-red-500" onClick={() => onDelete(data)}><Trash2Icon className="text-red-500" /> Hapus</DropdownMenuItem>}
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
    accessorKey: "no_invoice",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nomor Invoice
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.original
      return <div className="text-center">
        {data.no_invoice}
      </div>
    }
  },
  {
    accessorKey: "mitra.name",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mitra
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "nominal",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nominal
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.original
      return <div className="text-right">
        Rp. {data.nominal}
      </div>
    }
  },
]
