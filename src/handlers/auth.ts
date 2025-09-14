import { Request, Response } from 'express';
import openfort from '../config/openfort-client';
import { StatusCodeEnum } from "../types/enum";
import { AuthRequest } from "../types";
import { getEnvVariable } from "../utils";
import { OAuthProvider, CreateAccountRequest, TokenType } from '@openfort/openfort-node';

const chainId = parseInt(getEnvVariable('CHAIN_ID'));

export const authHandler = async (req: Request, res: Response) => {
    try {
        const { token } = req.body as AuthRequest;

        if (!token) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Token is required.' });
        }

        const playerResponse = await openfort.iam.verifyOAuthToken({
            provider: "google" as OAuthProvider,
            token: token,
            tokenType: "idToken" as TokenType,
        });

        // const playerResponse = await openfort.iam.verifyAuthToken(token)

        console.log("playerResponse", playerResponse);

        // Check if the player already has an account (wallet)
        if (playerResponse.accounts && playerResponse.accounts.length > 0) {
            const account = playerResponse.accounts[0];
            const response = {
                walletAddress: account.address,
                playerId: playerResponse.id,
                message: "Account already exists."
            };

            return res.status(StatusCodeEnum.OK).json(response);
        }

        // If no wallet exists, create a new one for this player
        const createAccountRequest: CreateAccountRequest = {
            player: playerResponse.id,
            chainId,
        };

        const newAccount = await openfort.accounts.create(createAccountRequest);

        // The response the frontend expects
        const responseObj = {
            walletAddress: newAccount.address,
            playerId: playerResponse.id,
            message: "New wallet created."
        };

        res.status(StatusCodeEnum.OK).json(responseObj);

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to authenticate and create wallet.' });
    }
};
