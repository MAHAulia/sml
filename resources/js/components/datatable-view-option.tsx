"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Table } from "@tanstack/react-table"
import { Download, PlusIcon, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  onAddButtonClicked?: () => void
  onDownloadButtonClicked?: () => void
  displayViewColumn?: boolean
}

export function DataTableViewOptions<TData>({
  table,
  onAddButtonClicked,
  displayViewColumn = true,
  onDownloadButtonClicked,
}: DataTableViewOptionsProps<TData>) {

  return (
    <DropdownMenu>
      {displayViewColumn && <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 />
          Kolom
        </Button>
      </DropdownMenuTrigger>}
      {onAddButtonClicked && <Button size="sm" className="ml-2" onClick={onAddButtonClicked}><PlusIcon /> Tambah</Button>}
      {onDownloadButtonClicked && <div className={displayViewColumn ? "" : "flex justify-end w-full" }><Button size="sm" className="ml-2" onClick={onDownloadButtonClicked}><Download /> Unduh</Button></div>}
      {displayViewColumn && <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id == "created_at" ? "Tanggal Dibuat" : column.id == "slug" ? "Link" : column.id == "total_response" ? "Jumlah Tanggapan" : column.id == "is_parent" ? "Parent" : column.id == "parent_id" ? "Parent Menu" : column.id == "order_number" ? "Nomor Urut" : column.id == "route_name" ? "Alias" : column.id == "transaction_id" ? "ID Transaksi" : column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>}
    </DropdownMenu>
  )
}
