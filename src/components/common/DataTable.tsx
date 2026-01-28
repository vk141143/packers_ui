import React, { useMemo } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
}

const TableRow = React.memo(<T extends { id: string }>({ 
  row, 
  columns, 
  onRowClick 
}: { 
  row: T; 
  columns: Column<T>[]; 
  onRowClick?: (row: T) => void; 
}) => (
  <tr
    onClick={() => onRowClick?.(row)}
    className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
  >
    {columns.map((column) => (
      <td key={`${row.id}-${String(column.header)}`} className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}>
        {typeof column.accessor === 'function'
          ? column.accessor(row)
          : String(row[column.accessor])}
      </td>
    ))}
  </tr>
));

export function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  onRowClick, 
  pageSize = 50 
}: DataTableProps<T>) {
  const paginatedData = useMemo(() => 
    data.slice(0, pageSize), 
    [data, pageSize]
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              columns={columns}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
      {data.length > pageSize && (
        <div className="px-6 py-3 text-sm text-gray-500 bg-gray-50">
          Showing {pageSize} of {data.length} items
        </div>
      )}
    </div>
  );
}
