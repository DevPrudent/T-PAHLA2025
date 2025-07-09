import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Search, Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PaginatedTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
  }[];
  caption?: string;
  itemsPerPage?: number;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  showDateFilter?: boolean;
  onDateChange?: (date: Date | undefined) => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  selectedDate?: Date | undefined;
  showStatusFilter?: boolean;
  statusOptions?: { value: string; label: string }[];
  onStatusChange?: (status: string) => void;
  selectedStatus?: string;
  renderRowActions?: (row: T) => React.ReactNode;
}

function PaginatedTable<T>({
  data,
  columns,
  caption,
  itemsPerPage = 10,
  searchPlaceholder = "Search...",
  onSearch,
  searchTerm = "",
  showDateFilter = false,
  onDateChange,
  currentPage: externalCurrentPage,
  setCurrentPage: setExternalCurrentPage,
  selectedDate,
  showStatusFilter = false,
  statusOptions = [],
  onStatusChange,
  selectedStatus,
  renderRowActions
}: PaginatedTableProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [dateInput, setDateInput] = useState<string>(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "");

  // Use external page state if provided, otherwise use internal state
  const pageState = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  const setPageState = setExternalCurrentPage || setInternalCurrentPage;

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (pageState - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
    setPageState(1); // Reset to first page on search
  };

  // Handle date input
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);
    
    // Try to parse the date
    if (value) {
      try {
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
          if (onDateChange) {
            onDateChange(parsedDate);
          }
        }
      } catch (error) {
        console.error("Invalid date format:", error);
      }
    } else if (onDateChange) {
      onDateChange(undefined);
    }
  };

  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (onDateChange) {
      onDateChange(date);
    }
    if (date) {
      setDateInput(format(date, "yyyy-MM-dd"));
    } else {
      setDateInput("");
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    
    // Always show first page
    if (totalPages > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink 
            onClick={() => setPageState(1)} 
            isActive={pageState === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (pageState > 3 && totalPages > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    const startPage = Math.max(2, pageState - 1);
    const endPage = Math.min(totalPages - 1, pageState + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i <= 1 || i >= totalPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setPageState(i)} 
            isActive={pageState === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (pageState < totalPages - 2 && totalPages > 3) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      // Only add last page if it's not already included in the loop above
      if (endPage < totalPages) {
        items.push(
          <PaginationItem key="last">
            <PaginationLink 
              onClick={() => setPageState(totalPages)} 
              isActive={pageState === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={localSearchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          
          {/* Date Filter */}
          {showDateFilter && (
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  type="date"
                  value={dateInput}
                  onChange={handleDateInputChange}
                  className="w-full"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleCalendarSelect(undefined);
                    setDateInput("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          )}
          
          {/* Status Filter */}
          {showStatusFilter && statusOptions.length > 0 && (
            <div>
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  if (onStatusChange) {
                    onStatusChange(value);
                  }
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Showing {data.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, data.length)} of {data.length}
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {renderRowActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor] !== undefined
                          ? String(row[column.accessor])
                          : 'N/A'}
                    </TableCell>
                  ))}
                  {renderRowActions && (
                    <TableCell className="text-right">
                      {renderRowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageState(Math.max(pageState - 1, 1))}
                disabled={pageState === 1}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Go to previous page</span>
              </Button>
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageState(Math.min(pageState + 1, totalPages))}
                disabled={pageState === totalPages}
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Go to next page</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default PaginatedTable;