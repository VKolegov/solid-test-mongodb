interface APIRequest {
    limit?: number;
    page?: number;
    [otherOptions: string]: unknown;
}