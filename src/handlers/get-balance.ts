import { Request, Response } from 'express';
import { getEnvVariable } from '../utils';
import { StatusCodeEnum } from '../types/enum';
import { ethers } from 'ethers';

const polygonAmoyRpcUrl = getEnvVariable('POLYGON_AMOY_RPC_URL');
const contractAddress = getEnvVariable('CONTRACT_ADDRESS');
const usdcDecimals = parseInt(getEnvVariable('USDC_CONTRACT_DECIMALS') || '6', 10);

// A minimal ERC-20 ABI to get the balance
const usdcAbi = [
    "function balanceOf(address owner) view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(polygonAmoyRpcUrl);
const usdcContract = new ethers.Contract(contractAddress, usdcAbi, provider);

export const getBalanceHandler = async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            return res.status(StatusCodeEnum.BAD_REQUEST).json({ error: 'Wallet address is required.' });
        }

        // Use Ethers.js to call the balanceOf function on the USDC smart contract
        const rawBalance = await usdcContract.balanceOf(walletAddress);

        // Format the balance from BigInt to a human-readable decimal string
        const formattedBalance = ethers.formatUnits(rawBalance, usdcDecimals);

        res.status(StatusCodeEnum.OK).json({ balance: formattedBalance });

    } catch (error) {
        console.error('Get balance error:', error);
        res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve balance.' });
    }
};