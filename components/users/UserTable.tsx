'use client';

import { DataTableColumnHeader } from '@/components/datatable/ColumnHeader';
import { ColumnToggle } from '@/components/datatable/ColumnToggle';
import { DataTableFacetedFilter } from '@/components/datatable/FacetedFilter';
import SkeletonWrapper from '@/components/shared/SkeletonWrapper';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getTrainers, GetTrainersType } from '@/lib/actions/trainer.action';
import { useCurrentRole } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import {
  Download,
  MoreHorizontal,
  PenBox,
  PlusCircle,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import DeleteUserDialog from './DeleteTrainerDialog';
import EditUserDialog from './EditUserDialog';

const emptyData: any[] = [];

type TrainerRow = GetTrainersType[0];

const columns: ColumnDef<TrainerRow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className='text-nowrap capitalize'>{row.original.user.name}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='line-clamp-3 text-justify'>
        {row.original.user.email!}
      </div>
    ),
  },

  {
    accessorKey: 'department',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Department' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className={cn('rounded-lg p-2 text-center capitalize')}>
        {row.original.department.name}
      </div>
    ),
  },
  {
    accessorKey: 'modules',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Modules' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <ul className={cn('rounded-lg p-2 text-center capitalize')}>
        {row.original.modules.map((module, i) => (
          <li key={i}>
            {module.name}({module.code}) - Level {module.level}
          </li>
        ))}
      </ul>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className={cn('rounded-lg p-2 text-center capitalize')}>
        {row.original.user.role}
      </div>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='phoneNumber' />
    ),
    cell: ({ row }) => (
      <p className='text-nowrap rounded p-2 text-center font-medium'>
        {row.original.user.phoneNumber}
      </p>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <RowActions user={row.original} />,
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

function UserTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const role = useCurrentRole();

  const { data: trainers, isFetching } = useQuery<GetTrainersType>({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainers(),
  });

  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data: trainers || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const departmentOptions = useMemo(() => {
    const departmentMap = new Map();
    trainers?.forEach((user) => {
      departmentMap.set(user?.user.name, {
        value: user.user.name,
        label: user.user.name,
      });
    });
    const uniquDepartment = new Set(departmentMap.values());
    return Array.from(uniquDepartment);
  }, [trainers]);

  const roleOptions = useMemo(() => {
    const roleMap = new Map();
    trainers?.forEach((user) => {
      roleMap.set(user.user.role, {
        value: user.user.role,
        label: user.user.role,
      });
    });
    const uniquRole = new Set(roleMap.values());
    return Array.from(uniquRole);
  }, [trainers]);

  return (
    <div className='w-full'>
      <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
        <div className='flex gap-2'>
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            {table.getColumn('department') && (
              <DataTableFacetedFilter
                options={departmentOptions}
                title='Department'
                column={table.getColumn('department')}
              />
            )}
          </SkeletonWrapper>
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            {table.getColumn('role') && (
              <DataTableFacetedFilter
                options={roleOptions}
                title='Role'
                column={table.getColumn('role')}
              />
            )}
          </SkeletonWrapper>
        </div>
        <div className='flex flex-wrap gap-2'>
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            <ColumnToggle table={table} />
          </SkeletonWrapper>
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            <Button
              variant={'outline'}
              size={'sm'}
              className='ml-auto h-8 lg:flex'
              onClick={() => {
                const data = table.getFilteredRowModel().rows.map((row) => ({
                  NO: row.original.id,
                  TITLE: row.original.name,
                  EMAIL: row.original.email,
                  STUTUS: row.original.role,
                  DEPARTMENT: row.original.Department.name,
                  PHONE: row.original.phoneNumber,
                  DATE: row.original.createdAt,
                }));
                handleExportCSV(data);
              }}
            >
              <Download className='mr-2 h-4 w-4' /> Export CSV
            </Button>
          </SkeletonWrapper>
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            {role === 'HOD' && (
              <Button asChild size='sm' className='h-8 gap-1'>
                <Link href={'/trainers/add'}>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Add New
                  </span>
                </Link>
              </Button>
            )}
          </SkeletonWrapper>
        </div>
      </div>
      <SkeletonWrapper isLoading={isFetching}>
        <div className='rounded-md border'>
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
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
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
}

export default UserTable;

function RowActions({ user }: { user: TrainerRow }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <DeleteUserDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        trainerId={user.id}
      />
      <EditUserDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        userId={user.id}
      />
      <DropdownMenu>
        <div className='flex w-full items-center justify-center'>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='flex items-center gap-2'
            onSelect={() => {
              setShowEditDialog((prev) => !prev);
            }}
          >
            <PenBox className='h-4 w-4 text-emerald-600' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className='flex items-center gap-2'
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon className='h-4 w-4 text-muted-foreground text-red-500' />{' '}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
