import { Request, Response } from 'express';
import openfort from '../config/openfort-client';
import { StatusCodeEnum } from '../types/enum';
import { getEnvVariable } from '../utils';

const openFortTransactionPolicyId = getEnvVariable('OPENFORT_TRANSACTION_POLICY_ID');

export const startRecoveryHandler = async (req: Request, res: Response) => {
    try {
        const { accountId, newOwnerAddress } = req.body;

        if (!accountId || !newOwnerAddress) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Missing account ID or new owner address.' });
        }

        // Use the Openfort SDK to start the account recovery process.
        // This initiates a time-locked proposal to transfer ownership.
        const recoveryResponse = await openfort.accounts.startRecovery({
            id: accountId,
            newOwnerAddress: newOwnerAddress,
            policy: openFortTransactionPolicyId,
        });

        // The response will contain a transaction intent and other details.
        // The frontend can now wait for the time lock to expire.
        res.status(StatusCodeEnum.OK).json({
            message: 'Account recovery proposal started successfully.',
            transactionIntentId: recoveryResponse.id,
            status: recoveryResponse.response?.status,
        });

    } catch (error) {
        console.error('Account recovery start error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to start account recovery.' });
    }
};