'use client';

import { DataTableColumnHeader } from '@/components/datatable/ColumnHeader';
import { ColumnToggle } from '@/components/datatable/ColumnToggle';
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
import { getLessons, GetLessonsType } from '@/lib/actions/lesson.action';
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
import { useState } from 'react';
import DeleteLessonDialog from './DeleteLessonDialog';
import EditLessonDialog from './EditLessonDialog';

const emptyData: any[] = [];

type LessonRow = GetLessonsType[0];

const columns: ColumnDef<LessonRow>[] = [
  {
    accessorKey: 'moduleId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Module Name' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className='text-nowrap capitalize'>{row.original.module.name}</div>
    ),
  },
  {
    accessorKey: 'trainerId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trainer Name' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className='text-nowrap capitalize'>
        {row.original.trainer.user.name}
      </div>
    ),
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lesson Start Time' />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap capitalize'>{row.original.startTime!}</div>
    ),
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lesson End Time' />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap capitalize'>{row.original.endTime!}</div>
    ),
  },
  {
    accessorKey: 'day',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Conducted Day' />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap capitalize'>{row.original.day!}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <RowActions lesson={row.original} />,
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

function LessonTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: lessons, isFetching } = useQuery<GetLessonsType>({
    queryKey: ['lessons'],
    queryFn: async () => await getLessons(),
  });

  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data: lessons || emptyData,
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

  return (
    <div className='w-full'>
      <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
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
                  MODULENAME: row.original.module.name,
                  TRAINERNAME: row.original.trainer.user.name,
                  STATTIME: row.original.startTime,
                  ENDTIME: row.original.endTime,
                  CONDUCTEDDAY: row.original.day,
                }));
                handleExportCSV(data);
              }}
            >
              <Download className='mr-2 h-4 w-4' /> Export CSV
            </Button>
          </SkeletonWrapper>
          <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
            <Button asChild size='sm' className='h-8 gap-1'>
              <Link href={'/lessons/add'}>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Add New
                </span>
              </Link>
            </Button>
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

export default LessonTable;

function RowActions({ lesson }: { lesson: LessonRow }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <DeleteLessonDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        lessonId={lesson.id}
      />
      <EditLessonDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        lessonId={lesson.id}
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
