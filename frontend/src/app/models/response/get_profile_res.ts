export interface GetProfileResponse {
  id: number;
  username: string;
  email: string;
  profile_image: string;
  role: string;
  wallet_balance: string;
  created_at: string; 
}
export interface UserReq {
  username: string;
  email: string;
}