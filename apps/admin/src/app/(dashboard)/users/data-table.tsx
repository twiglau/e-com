"use client";


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { 
    ColumnDef, 
    flexRender, 
    getCoreRowModel, 
    getPaginationRowModel, 
    getSortedRowModel, 
    SortingState, 
    useReactTable 
} from "@tanstack/react-table";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {  User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

  const { getToken } = useAuth();
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        state: {
            sorting,
            rowSelection
        }
    })

    const mutation = useMutation({
        mutationFn: async () => {
            const token = await getToken({template: "long-lived"});
            const selectedRows = table.getSelectedRowModel().rows;

            Promise.all(
                selectedRows.map(async (row) => {
                    const userId = (row.original as User).id;
                    const res = await fetch(
                            `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${userId}`,
                            {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                    );
                })
            );
        },
        onSuccess: () => {
            toast.success("User(s) deleted successfully");
            router.refresh()
        },
        onError: (error) => {
        toast.error(error.message);
        },
    });
  
    return (
        <div className="rounded-md border">
            {Object.keys(rowSelection).length > 0 && (
                <div className="flex justify-end">
                    <Button
                        className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md m-4 cursor-pointer"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        <Trash2 className="w-4 h-4" />
                        {mutation.isPending ? "Deleting" : "Delete User(s)"}
                    </Button>
                </div>
            )}
            <Table> 
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}       