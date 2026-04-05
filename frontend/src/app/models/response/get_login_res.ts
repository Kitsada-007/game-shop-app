export interface GetLoginResponse {
    role: string;
    success: boolean;
    message: string;
    payload: Payload;
    token:   string;
}

export interface Payload {
    id:    number;
    email: string;
    role:  string;
}