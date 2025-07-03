export interface RequestFilters {
  type: string;
  status: string;
  serviceType: string;
  storageType: string;
  dateFrom: string;
  dateTo: string;
}

export interface PaginatedRequests<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}