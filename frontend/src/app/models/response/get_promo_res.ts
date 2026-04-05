export interface GetPromoResponse {
    id:               number;
    code:             string;
    discount_percent: string;
    max_uses:         number;
    current_uses:     number;
    is_active:        number;
    created_at:       Date;
}