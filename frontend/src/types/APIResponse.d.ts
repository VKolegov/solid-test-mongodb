type APIResponse<T> = {
    total: number;
    page: number;
    entities: T[];
}