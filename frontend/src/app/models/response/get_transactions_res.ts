export interface GetTransactionsWalletResponse {
    id:          number;
    user_id:     number;
    type:        string;
    amount:      string;
    order_id:    null;
    description: string;
    created_at:  Date;
}