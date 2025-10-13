"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronDown, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExportButton } from "@/components/CardActionMenus";

type Order = {
  id: string;
  customerName: string;
  items: number;
  amount: number;
  paymentMethod: string;
  status: "new-order" | "in-progress" | "completed" | "return" | "on-hold";
};

const data: Order[] = [
  {
    id: "1083",
    customerName: "Somchai Wongsuk",
    items: 2,
    amount: 34.5,
    paymentMethod: "E-Wallet",
    status: "new-order"
  },
  {
    id: "1082",
    customerName: "Wichai Theerawat",
    items: 6,
    amount: 60.5,
    paymentMethod: "Bank Transfer",
    status: "in-progress"
  },
  {
    id: "1081",
    customerName: "Apinya Sanitwong",
    items: 3,
    amount: 47.5,
    paymentMethod: "E-Wallet",
    status: "new-order"
  },
  {
    id: "1079",
    customerName: "Kittipong Charoensuk",
    items: 15,
    amount: 89.8,
    paymentMethod: "Bank Transfer",
    status: "on-hold"
  },
  {
    id: "1078",
    customerName: "Nattaya Maneerat",
    items: 4,
    amount: 120.75,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: "1077",
    customerName: "Chaiyaporn Suwanprasert",
    items: 8,
    amount: 210.5,
    paymentMethod: "PayPal",
    status: "completed"
  },
  {
    id: "1076",
    customerName: "Siriporn Wattana",
    items: 1,
    amount: 25.99,
    paymentMethod: "E-Wallet",
    status: "in-progress"
  },
  {
    id: "1075",
    customerName: "Anupong Theerawat",
    items: 3,
    amount: 78.45,
    paymentMethod: "Bank Transfer",
    status: "return"
  },
  {
    id: "1074",
    customerName: "Nattapong Lertsak",
    items: 5,
    amount: 145.2,
    paymentMethod: "Credit Card",
    status: "new-order"
  },
  {
    id: "1073",
    customerName: "Sumalee Sanitwong",
    items: 2,
    amount: 67.8,
    paymentMethod: "PayPal",
    status: "in-progress"
  },
  {
    id: "1072",
    customerName: "Suchart Punyakul",
    items: 7,
    amount: 198.35,
    paymentMethod: "Bank Transfer",
    status: "completed"
  },
  {
    id: "1071",
    customerName: "Pornthip Wongsuk",
    items: 4,
    amount: 112.9,
    paymentMethod: "E-Wallet",
    status: "on-hold"
  },
  {
    id: "1070",
    customerName: "Thaksin Boonyarit",
    items: 9,
    amount: 245.75,
    paymentMethod: "Credit Card",
    status: "new-order"
  },
  {
    id: "1069",
    customerName: "Busaba Rojchanawong",
    items: 3,
    amount: 87.6,
    paymentMethod: "Bank Transfer",
    status: "return"
  },
  {
    id: "1068",
    customerName: "Pranee Chaimongkol",
    items: 6,
    amount: 156.4,
    paymentMethod: "PayPal",
    status: "completed"
  },
  {
    id: "1067",
    customerName: "Apinya Thanaporn",
    items: 2,
    amount: 54.25,
    paymentMethod: "E-Wallet",
    status: "in-progress"
  }
];

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80
  },
  {
    accessorKey: "customerName",
    header: "Customer Name"
  },
  {
    accessorKey: "items",
    header: "Qty Items",
    cell: ({ row }) => `${row.getValue("items")} Items`
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `$${row.getValue("amount")}`
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap = {
        completed: "success",
        "new-order": "info",
        "in-progress": "warning",
        "on-hold": "warning",
        return: "destructive"
      } as const;

      const statusClass = statusMap[status] ?? "default";

      return (
        <Badge variant={statusClass} className="capitalize">
          {status.replace("-", " ")}
        </Badge>
      );
    }
  }
];

export function TableOrderStatus() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 6
      }
    }
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Track Order Status</CardTitle>
        <CardDescription>Analyze growth and changes in visitor patterns</CardDescription>
        <CardAction>
          <ExportButton />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="font-display text-2xl lg:text-3xl">43</div>
            <div className="flex gap-2">
              <div className="text-muted-foreground text-sm">New Order</div>
              <div className="flex items-center gap-0.5 text-xs text-green-500">
                <ArrowUpIcon className="size-3" />
                0.5%
              </div>
            </div>
            <Progress
              value={43}
              className="h-2 bg-blue-100 dark:bg-blue-950"
              indicatorColor="bg-blue-400"
            />
          </div>
          <div className="space-y-2">
            <div className="font-display text-2xl lg:text-3xl">12</div>
            <div className="flex gap-2">
              <div className="text-muted-foreground text-sm">On Progress</div>
              <div className="flex items-center gap-0.5 text-xs text-red-500">
                <ArrowDownIcon className="size-3" />
                0.3%
              </div>
            </div>
            <Progress
              value={25}
              className="h-2 bg-teal-100 dark:bg-teal-950"
              indicatorColor="bg-teal-400"
            />
          </div>
          <div className="space-y-2">
            <div className="font-display text-2xl lg:text-3xl">40</div>
            <div className="flex gap-2">
              <div className="text-muted-foreground text-sm">Completed</div>
              <div className="flex items-center gap-0.5 text-xs text-green-500">
                <ArrowUpIcon className="size-3" />
                0.5%
              </div>
            </div>
            <Progress
              value={40}
              className="h-2 bg-green-100 dark:bg-green-950"
              indicatorColor="bg-green-400"
            />
          </div>
          <div className="space-y-2">
            <div className="font-display text-2xl lg:text-3xl">2</div>
            <div className="flex gap-2">
              <div className="text-muted-foreground text-sm">Return</div>
              <div className="flex items-center gap-0.5 text-xs text-red-500">
                <ArrowDownIcon className="size-3" />
                0.5%
              </div>
            </div>
            <Progress
              value={48}
              className="h-2 bg-orange-100 dark:bg-orange-950"
              indicatorColor="bg-orange-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter orders..."
              value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("customerName")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
