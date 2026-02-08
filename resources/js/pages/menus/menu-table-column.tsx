"use client"

import { MenuData } from "@/types"
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

type ColumnProps = {
  onView: (data: MenuData) => void;
  onEdit: (data: MenuData) => void;
  onDelete: (data: MenuData) => void;
};

export const menuTableColumn = ({ onView, onEdit, onDelete }: ColumnProps): ColumnDef<MenuData>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "route_name",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alias
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "icon",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Icon
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const icon = row.getValue("icon") as string
      const previewIcon = (Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.LayoutGrid;
      return  <div className="flex justify-center"><Icon iconNode={previewIcon} className="h-5 w-5" /></div>
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
          Type
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      let style = "bg-blue-500 text-white"
      if (type == "api") {
        style = "bg-green-500 text-white"
      } else if (type == "form") {
        style = "bg-orange-500 text-white"
      }
      return  <div className="flex justify-center"><Badge className={style}>{type}</Badge></div>
    }
  },
  {
    accessorKey: "is_parent",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parent
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isParent = row.getValue("is_parent") as boolean
      let style = "bg-orange-500 text-white"
      if (isParent == false) {
        style = "bg-yellow-500 text-white"
      }
      return  <div className="flex justify-center"><Badge className={style}>{isParent ? "Parent" : "Child"}</Badge></div>
    }
  },
  {
    accessorKey: "parent_id",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parent Menu
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const parentLabel = row.original.parent?.label || '-'
      if (parentLabel == "-") {
        return <div className="flex justify-center"></div>
      }
      return <div className="flex justify-center"><Badge className="bg-blue-500 dark:bg-blue-200">{parentLabel}</Badge></div>
    }
  },
  {
    accessorKey: "order_number",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nomor Urut
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const order_number = row.getValue("order_number") as string
      
      return  <div className="flex justify-center">{order_number}</div>
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
