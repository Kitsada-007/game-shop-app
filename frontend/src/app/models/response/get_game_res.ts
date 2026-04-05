export interface GetGameResponse {
    id: number;
    name: string;
    price: string;
    genre: string;
    description: string;
    total_sales: number;
    release_date: Date;
    created_at: Date;
    updated_at: Date;
    images: string[];
}
