export interface GetRegisterResponse {
    token: string | undefined;
    success: boolean;
    message: string;
    userId:  number;
}