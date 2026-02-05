'use client';

import * as React from 'react';
import { type ColumnDef, type ColumnFiltersState, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Search, Edit, Trash2, LoaderCircle, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
// import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CardContent } from '@/components/ui/card';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getServiceList, updateStatusForService } from '@/http/Services/all';
import { base64Encode, formatDate, formatTime, showError, showSuccess } from '@/utility/utility';
import { confirmationStore } from '@/store/store';
import { ModalType } from '@/shared-component/Confirmation';

// LAZY LOAD DRAWER COMPONENT
// const ServiceFilter = React.lazy(() => import('../dialogs/ServiceFilter'));
// const EditProjectDrawer = React.lazy(() => import('../dialogs/EditSeoPage').then((module) => ({ default: module.default }))
const EditProjectDrawer = React.lazy(() => import('../dialogs/EditSeoPage'));

const frontenURL = import.meta.env.VITE_API_FRONTEND_URL;

export type StatusType = 'active' | 'inactive' | string;
export type Service = {
  service_id: number;
  country_id: number;
  alpha2_code: string;
  seo_page_id: number;
  city_id: number;
  location: string;
  page_unique_id: string;
  project_title: string;
  updated_at: string;
  time: string;
  status: StatusType;
  seo_slug_url: string;
};

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'project_title',
    header: 'Project Title',
    cell: ({ row }) => (
      <div className="font-medium text-blue-400 text-sm">
        <a href={`${frontenURL}${row.original?.seo_slug_url}`} target="_blank">
          {row.original.project_title}
        </a>
      </div>
    ),
    enableSorting: false,
    minSize: 300,
    size: 350,
  },
  {
    accessorKey: 'alpha2_code',
    header: 'CN',
    cell: ({ row }) => {
      const countryCode = row.original.alpha2_code != null ? String(row.original.alpha2_code) : '';
      return (
        <img
          src={`https://countryflagsapi.netlify.app/flag/${countryCode}.svg`}
          className="h-4 w-auto"
          alt="flag"
        />
      );
    },
    enableSorting: false,
    size: 60,
    minSize: 60,
  },
  {
    accessorKey: 'location',
    header: 'City',
    cell: ({ row }) => (
      <div className="text-sm text-gray-900 font-medium">{row.original.location ?? '—'}</div>
    ),
    enableSorting: false,
    size: 120,
    minSize: 100,
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at;
      return <div className="text-sm text-gray-900 font-medium">{formatDate(updatedAt)}</div>;
    },
    enableSorting: false,
    size: 110,
    minSize: 100,
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => {
      const time = row.original.updated_at;
      return <div className="text-sm text-gray-900 font-medium">{formatTime(time)}</div>;
    },
    enableSorting: false,
    size: 110,
    minSize: 100,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const status = row.getValue('status') as string;
      const isActive = status === 'active';
      const displayStatus = isActive ? 'Active' : 'In-Active';
      return (
        <div className="flex items-center justify-between gap-14">
          <span
            className={`text-xs font-medium ${isActive ? 'text-green-800' : 'text-orange-600'}`}
          >
            {displayStatus}
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => {}}
              className="sr-only peer"
            />

            {/* Track */}
            <div
              className={`w-10 h-5 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-green-300' : 'bg-gray-200'
              }`}
            >
              {/* Knob */}
              <div
                className={`
          absolute top-0.5 left-0.5
          h-4 w-4 bg-white rounded-full shadow
          transition-transform duration-300
          ${isActive ? 'translate-x-5' : ''}
        `}
              ></div>
            </div>
          </label>
        </div>
      );
    },
    enableSorting: false,
    size: 150,
    minSize: 200,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }: any) => {
      return (
        <div className="flex items-center gap-2">
          <a href={`${frontenURL}${row.original?.seo_slug_url}`} target="_blank">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-cyan-600 hover:text-cyan-700 hover:bg-blue-50 cursor-pointer"
              onClick={() => {}}
            >
              <Building2 className="h-4 w-4 text-cyan-600" />
              {/* <Trash2 className="h-4 w-4" /> */}
            </Button>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            onClick={() => {}}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
            onClick={() => {}}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    size: 140,
    minSize: 130,
  },
];

const ServicesPage = () => {
  const [servicesData, setServicesData] = React.useState<Service[]>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState('');
  const [showSearchSpinner, setShowSearchSpinner] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [limit] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  // const [open, setOpen] = React.useState(false);
  const [open] = React.useState(false);
  // Edit Project
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerOpenData, setDrawerOpenData] = React.useState({});
  const { openConfirmation } = confirmationStore();

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmedValue = searchValue.trim();
      setDebouncedSearchValue(trimmedValue);
      if (trimmedValue.length > 0) {
        setShowSearchSpinner(true);
      } else {
        setShowSearchSpinner(false);
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  const { data, isLoading, isError, isFetching, refetch  }: any = useQuery({
    queryKey: ['servicelist', offset, limit, debouncedSearchValue],
    queryFn: () => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
        page_type: 'service',
      });

      if (debouncedSearchValue) {
        params.append('search', debouncedSearchValue);
      }

      const queryString = params.toString();

      return getServiceList(queryString ? `?${queryString}` : '');
    },
  });

  React.useEffect(() => {
    if (!isFetching) {
      setShowSearchSpinner(false);
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (!data) {
      setServicesData([]);
      setTotalCount(0);
      return;
    }

    const responsePayload = data.data;
    const pagesData = Array.isArray(responsePayload?.data?.pagesData)
      ? responsePayload.data.pagesData
      : [];

    setServicesData(pagesData as Service[]);
    const totalFromResponse =
      typeof responsePayload?.data?.total === 'number'
        ? responsePayload.data.total
        : parseInt(responsePayload.data.total);
    setTotalCount(totalFromResponse);
  }, [data]);

  React.useEffect(() => {
    setOffset(0);
  }, [debouncedSearchValue]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateStatusForService(id, status),

    onSuccess: (data: any) => {
      const { seo_page_id, status } = data?.data?.data;
      showSuccess('Status updated successfully');
      setServicesData((prev: any) =>
        prev.map((service: any) =>
          service.seo_page_id === seo_page_id ? { ...service, status: status } : service,
        ),
      );
    },

    onError: (error: any) => {
      console.log('error: ', error);
      // showError('Failed to update status!');
      showError(error?.response?.data?.message);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateStatusForService(id, status),

    onSuccess: (data: any) => {
      const { seo_page_id } = data?.data?.data;
      showSuccess('Page deleted successfully');
      // console.log('totalFromResponse')
      if(totalCount < 11){
        setServicesData((prev: any) => prev.filter((service: any) => service.seo_page_id !== seo_page_id));
      }else{
        refetch();
      }
    },

    onError: (error: any) => {
      console.log('error: ', error);
      showError(error?.response?.data?.message);
    },
  });

  // Delete Service
  const deleteService = async (pageUniqueId: any) => {
    const response = await openConfirmation({
      title: 'Delete service?',
      description: 'Are you sure you want to delete this service?',
      type: ModalType.DESTRUCTIVE,
    });
    if (!response.confirmed) return;
    deleteMutation.mutate({
      id: base64Encode(pageUniqueId),
      status: 'delete',
    });
  };

  // Update Status
  const updateServiceStatus = React.useCallback(
    (pageUniqueId: string, newStatus: 'active' | 'inactive') => {
      updateStatusMutation.mutate({
        id: base64Encode(pageUniqueId),
        status: newStatus,
      });
    },
    [],
  );

  // Edit Project
  const openEditProjectDrawer = React.useCallback((projectData: any) => {
    setDrawerOpenData(projectData);
    setDrawerOpen(true);
  }, []);

  const columnsWithUpdate = React.useMemo<ColumnDef<Service>[]>(() => {
    return columns.map((col: any) => {
      if (col.accessorKey === 'status') {
        return {
          ...col,
          cell: ({ row }: any) => {
            const status = row.getValue('status') as string;
            const isActive = status === 'active';
            const displayStatus = isActive ? 'Active' : 'Inactive';
            const pageUniqueId = row.original.seo_page_id;
            return (
              <div className="flex items-center gap-14">
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-green-800' : 'text-orange-600'
                  }`}
                >
                  {displayStatus}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => {
                      const newStatus = e.target.checked ? 'active' : 'inactive';
                      updateServiceStatus(pageUniqueId, newStatus);
                    }}
                    className="sr-only peer"
                  />
                  <div
                    className={`
                    w-10 h-5 rounded-full transition-colors duration-300
                    ${isActive ? 'bg-green-300' : 'bg-gray-200'}
                  `}
                  >
                    <div
                      className={`
                      absolute top-0.5 left-0.5
                      h-4 w-4 bg-white rounded-full shadow
                      transition-transform duration-300
                      ${isActive ? 'translate-x-5' : ''}
                    `}
                    ></div>
                  </div>
                </label>
              </div>
            );
          },
        };
      }
      if (col.id === 'actions') {
        return {
          ...col,
          cell: ({ row }: any) => {
            const seoPageId = row.original.seo_page_id;
            return (
              <div className="flex items-center gap-2">
                <a href={`${frontenURL}${row.original?.seo_slug_url}`} target="_blank">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-cyan-600 hover:text-cyan-700 hover:bg-blue-50 cursor-pointer"
                    onClick={() => {}}
                  >
                    <Building2 className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  onClick={() => deleteService(seoPageId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                  onClick={() => openEditProjectDrawer(row.original)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            );
          },
        };
      }
      return col;
    });
  }, [updateServiceStatus, openEditProjectDrawer]);

  const table = useReactTable({
    data: servicesData,
    columns: columnsWithUpdate,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Removed getFilteredRowModel to prevent client-side filtering when using server-side search
    enableSorting: false,
    state: {
      columnFilters,
    },
  });

  return (
    <div className="w-full space-y-6 p-6">
      {/* Lazy load only when open is true */}
      {open && (
        <React.Suspense fallback={<p>Loading Drawer...</p>}>
          {/* <ServiceFilter
            open={open}
            onOpenChange={setOpen}
            onCloseData={(data: any) => {
              console.log('data: ', data);
            }}
          /> */}
        </React.Suspense>
      )}

      {/* Lazy load only when open is true load edit project component */}
      {drawerOpen && (
        <React.Suspense fallback={<p>Loading...</p>}>
          <EditProjectDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            openData={drawerOpenData}
            onCloseData={(data: any) => {
              if (data?.isCheck === 'edit') {
                setServicesData((prev: any) => {
                  const index = prev.findIndex(
                    (service: any) => service.seo_page_id === data?.data?.seo_page_id,
                  );
                  if (index === -1) return prev;
                  const updated = [...prev];
                  updated[index] = data?.data;
                  return updated;
                });
              }

              if (data?.isCheck === 'delete') {
                deleteService(data?.data?.seo_page_id);
                setDrawerOpen(false);
              }
            }}
          />
        </React.Suspense>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl leading-sm font-bold tracking-tight font-geist">
            Service SEO Pages
          </h1>
          <p className="text-muted-foreground">
            Create AI-powered landing pages for keyword clusters
          </p>
        </div>
      </div>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="pl-9 pr-9 w-100"
            />
            {showSearchSpinner && (
              <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground pointer-events-none z-10" />
            )}
          </div>
          {/* <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div> */}
        </div>

        {/* Table Section */}
        <div className="mt-6 overflow-x-auto rounded-md border">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="h-9 border-b odd:bg-white even:bg-red-300"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-9 p-2 whitespace-nowrap"
                        style={{
                          minWidth: header.column.columnDef.minSize
                            ? `${header.column.columnDef.minSize}px`
                            : undefined,
                          width: header.column.getSize()
                            ? `${header.column.getSize()}px`
                            : undefined,
                        }}
                      >
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columnsWithUpdate.length} className="h-24 text-center">
                    Loading services...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columnsWithUpdate.length}
                    className="h-24 text-center text-destructive"
                  >
                    Unable to load services. Please try again.
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="h-9 border-b hover:bg-muted/50 transition-colors odd:bg-white even:bg-neutral-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="h-9 p-2 whitespace-nowrap"
                        style={{
                          minWidth: cell.column.columnDef.minSize
                            ? `${cell.column.columnDef.minSize}px`
                            : undefined,
                          width: cell.column.getSize() ? `${cell.column.getSize()}px` : undefined,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columnsWithUpdate.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {totalCount && totalCount > 10 && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {/* Showing {servicesData.length} row(s){isFetching ? ' (updating...)' : ''}. */}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                disabled={offset === 0 || isFetching}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {Math.floor(offset / limit) + 1} of{' '}
                {totalCount > 0 ? Math.max(1, Math.ceil(totalCount / limit)) : '—'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset((prev) => prev + limit)}
                disabled={
                  isFetching ||
                  (totalCount > 0 ? offset + limit >= totalCount : servicesData.length < limit)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {/* </Card> */}
    </div>
  );
};

export default ServicesPage;
