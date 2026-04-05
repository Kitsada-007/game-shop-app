export interface UserReq {
  username: string;
  email: string;
}
export interface UserRes {
  id: number;
  username: string;
  email: string;
  profile_image: string;
  role: string;
  wallet_balance: string;
  created_at: string; 
}
