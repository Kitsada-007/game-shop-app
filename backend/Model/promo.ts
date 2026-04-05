export interface PromoRes {
    id:               number;
    code:             string;
    discount_percent: string;
    max_uses:         number;
    current_uses:     number;
    is_active:        number;
    created_at:       string;
}

export interface PromoReq {
    code:             string;
    discount_percent: string;
    max_uses:         number;
}
