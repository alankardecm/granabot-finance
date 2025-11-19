export interface AuthenticatedUser {
  sub: string;
  email: string;
  nome?: string;
  plano?: string;
  userId?: string; // helper to keep compatibility
}
