export interface GameReq {
    name:         string;
    price:        string;
    genre:        string;
    description:  string;
}


export interface GameRes {
    id:           number;
    name:         string;
    price:        string;
    genre:        string;
    description:  string;
    release_date: string;
    total_sales:  number;
    created_at:   string;
    updated_at:   string;
}
