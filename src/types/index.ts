export interface SendRequest {
    senderWallet: string;
    recipientWallet: string;
    amount: string;
}

export interface AuthRequest {
    token: string;
}

export interface AuthResponse {
    walletAddress: string;
}