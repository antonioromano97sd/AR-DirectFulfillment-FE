export class PagingModel<T> {
  content!: T;
  first!: boolean;
  last!: boolean;
  pageNumber!: number;
  pageSize!: number;
  totalElements!: number;
  totalPages!: number;
}
