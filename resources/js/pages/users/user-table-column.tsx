"use client"

import { UserData } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit3, MailPlus, MoreHorizontal, SearchIcon, Trash2Icon } from "lucide-react"
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

type ColumnProps = {
  onView: (user: UserData) => void;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  onResendVerify: (user: UserData) => void;
};

export const userTableColumn = ({ onView, onEdit, onDelete, onResendVerify }: ColumnProps): ColumnDef<UserData>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
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
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal Dibuat
          <ArrowUpDown className="ml-auto h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string
      const date = new Date(createdAt);
      const formatedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);

      return <div className="">{formatedDate}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      
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
              onClick={() => onView(user)}
            >
              <SearchIcon /> Lihat
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(user)}
            >
              <Edit3 /> Ubah
            </DropdownMenuItem>
            {!user.email_verified_at && <DropdownMenuItem onClick={() => onResendVerify(user)}><MailPlus />  Kirim Ulang Email Verifikasi</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={() => onDelete(user)}><Trash2Icon className="text-red-500" /> Hapus</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
