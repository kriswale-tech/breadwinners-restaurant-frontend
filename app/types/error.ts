export interface ErrorResponse {
    message: string
    detail: string
    status_code: number
    errors: Record<string, string[]>
}