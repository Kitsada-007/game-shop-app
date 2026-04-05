export interface GetOrderGameResponse {
    success:           boolean;
    message:           string;
    order_id:          number;
    total_price:       number;
    discount:          number;
    final_price:       number;
    remaining_balance: number;
    games_purchased:   GamesPurchased[];
}

export interface GamesPurchased {
    id:    number;
    name:  string;
    price: string;
}