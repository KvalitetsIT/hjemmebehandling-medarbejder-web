export interface PaginatedList<T> {
    list: T[],
    total: number,
    offset: number,
    limit: number
}

