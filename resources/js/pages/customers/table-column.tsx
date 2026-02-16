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
import { Icon } from "@/components/icon"
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { CustomerData } from "@/types/customer"

type ColumnProps = {
  onView: (data: CustomerData) => void;
  onEdit: (data: CustomerData) => void;
  onDelete: (data: CustomerData) => void;
};

export const menuTableColumn = ({ onView, onEdit, onDelete }: ColumnProps): ColumnDef<CustomerData>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Customer
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nomor Telepon
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alamat
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    }
  },
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
            <DropdownMenuItem
              onClick={() => onEdit(data)}
            >
              <Edit3 /> Ubah
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={() => onDelete(data)}><Trash2Icon className="text-red-500" /> Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
