'use client';

import * as React from 'react';
import { type ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Search, Edit, Trash2, LoaderCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utility/utility';
import { usersListData } from '@/utility/testdata';

export type StatusType = 'active' | 'inactive' | 'pending' | 'deactivated';

export type User = {
  user_id: number;
  name: string;
  phone?: string;
  location: string;
  credit: number;
  loans: number;
  created_at: string;
  status: StatusType;
};

// Temporary JSON data for testing
const TEMP_USERS_DATA: any[] = usersListData;

const getStatusBadgeClass = (status: StatusType) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/20';
    case 'inactive':
      return 'bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20';
    case 'pending':
      return 'bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20';
    case 'deactivated':
      return 'bg-red-500/10 text-red-700 border-red-200 hover:bg-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 border-gray-200 hover:bg-gray-500/20';
  }
};

const getStatusLabel = (status: StatusType) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getCreditColor = (credit: number) => {
  if (credit >= 700) return 'text-green-600';
  if (credit >= 600) return 'text-orange-500';
  return 'text-red-600';
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.name}</span>
        {row.original.phone && (
          <span className="text-xs text-blue-500">{row.original.phone}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'location',
    header: 'City',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.location}</span>
    ),
  },
  {
    accessorKey: 'credit',
    header: 'Credit',
    cell: ({ row }) => (
      <span className={`text-sm font-semibold ${getCreditColor(row.original.credit)}`}>
        {row.original.credit}
      </span>
    ),
  },
  {
    accessorKey: 'loans',
    header: 'Loans',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.loans}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={getStatusBadgeClass(row.original.status)}>
        {getStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{formatDate(row.original.created_at)}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => console.log('Edit user:', row.original.user_id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => console.log('Delete user:', row.original.user_id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const UsersPage = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState('');
  const [showSearchSpinner, setShowSearchSpinner] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [limit] = React.useState(10);

  // Debounce search input
  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmedValue = searchValue.trim();
      setDebouncedSearchValue(trimmedValue);
      setShowSearchSpinner(false);
    }, 500);

    if (searchValue.trim().length > 0) {
      setShowSearchSpinner(true);
    }

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  // Reset to first page when search changes
  React.useEffect(() => {
    setOffset(0);
  }, [debouncedSearchValue]);

  // Filter data based on search
  const filteredUsers = React.useMemo(() => {
    if (!debouncedSearchValue) {
      return TEMP_USERS_DATA;
    }

    const searchLower = debouncedSearchValue.toLowerCase();
    return TEMP_USERS_DATA.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.location.toLowerCase().includes(searchLower) ||
        user.status.toLowerCase().includes(searchLower)
      );
    });
  }, [debouncedSearchValue]);

  // Paginate filtered data
  const paginatedUsers = React.useMemo(() => {
    const start = offset;
    const end = offset + limit;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, offset, limit]);

  const totalCount = filteredUsers.length;

  const table = useReactTable({
    data: paginatedUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <>
    {/* <div className="w-full space-y-6 p-6"> */}
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage users and their information</p>
        </div>
      </div>

      <CardContent>
        {/* Search Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 pr-9"
            />
            {showSearchSpinner && (
              <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
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
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {totalCount > limit && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                disabled={offset === 0}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {Math.floor(offset / limit) + 1} of {Math.ceil(totalCount / limit)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset((prev) => prev + limit)}
                disabled={offset + limit >= totalCount}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    {/* </div> */}
    </>

  );
};

export default UsersPage;
