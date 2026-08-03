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
import { ArrowUpDown, BoxIcon, MoreHorizontal, PlusCircle, Printer, SearchIcon, Trash2Icon } from "lucide-react"
// import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge } from "@/components/status-badge"
import { ManifestSerahData } from "@/types/manifest-serah"

type ColumnProps = {
  onView: (data: ManifestSerahData) => void;
  onEdit: (data: ManifestSerahData) => void;
  onDelete: (data: ManifestSerahData) => void;
  onTutupManifest: (data: ManifestSerahData) => void;
  onPrint: (data: ManifestSerahData) => void;
};

export const manifestSerahTableColumns = ({ onView, onEdit, onDelete, onTutupManifest, onPrint }: ColumnProps): ColumnDef<ManifestSerahData>[] => [
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
              <SearchIcon /> Lihat {data.status }
            </DropdownMenuItem>
            
            {(data.status === "created") && <DropdownMenuItem
              onClick={() => onEdit(data)}
            >
              <PlusCircle /> Tambah Item Manifest
            </DropdownMenuItem>}
            {(data.items.length != 0 && data.status == 'created') && <DropdownMenuItem
              onClick={() => onTutupManifest(data)}
            >
              <BoxIcon /> Tutup Manifest
            </DropdownMenuItem>}
            {(data.items.length != 0 && data.status == 'send') && <DropdownMenuItem
              onClick={() => onPrint(data)}
            >
              <Printer /> Cetak
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
    accessorKey: "code",
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Jenis Manifest
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "office_from",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Office From
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "from",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          From
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "office_to",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Office To
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "to",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          To
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
]
