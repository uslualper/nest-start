export interface PaginationInterface<T> {
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
