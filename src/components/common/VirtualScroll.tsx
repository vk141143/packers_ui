import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function VirtualScroll<T extends { id: string }>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  onLoadMore,
  hasMore = false,
  loading = false
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = start + visibleCount;

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);

    // Load more when near bottom
    if (onLoadMore && hasMore && !loading) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const threshold = scrollHeight - clientHeight - 200; // 200px before bottom
      
      if (newScrollTop >= threshold) {
        onLoadMore();
      }
    }
  }, [onLoadMore, hasMore, loading]);

  return (
    <div
      ref={scrollElementRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={item.id}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

// Optimized table with virtual scrolling
interface VirtualTableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: number;
  className?: string;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: VirtualTableColumn<T>[];
  onRowClick?: (row: T) => void;
  rowHeight?: number;
  containerHeight?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function VirtualTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  rowHeight = 60,
  containerHeight = 400,
  onLoadMore,
  hasMore,
  loading
}: VirtualTableProps<T>) {
  const renderRow = useCallback((item: T, index: number) => (
    <div
      className={`flex border-b border-gray-200 ${
        onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''
      }`}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          className={`px-4 py-3 text-sm ${column.className || ''}`}
          style={{ width: column.width || `${100 / columns.length}%` }}
        >
          {typeof column.accessor === 'function'
            ? column.accessor(item)
            : String(item[column.accessor])}
        </div>
      ))}
    </div>
  ), [columns, onRowClick]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex">
          {columns.map((column, index) => (
            <div
              key={index}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: column.width || `${100 / columns.length}%` }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Virtual scrolled content */}
      <VirtualScroll
        items={data}
        itemHeight={rowHeight}
        containerHeight={containerHeight}
        renderItem={renderRow}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
      />
    </div>
  );
}