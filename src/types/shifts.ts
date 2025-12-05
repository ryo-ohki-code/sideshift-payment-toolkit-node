export interface QuoteData {
    id: string;
    createdAt: string; // ISO date string
    depositCoin: string;
    settleCoin: string;
    depositNetwork: string;
    settleNetwork: string;
    expiresAt: string; // ISO date string
    depositAmount: string; // String representation of number
    settleAmount: string; // String representation of number
    rate: string; // String representation of number
    affiliateId?: string;
}

interface BaseShiftData {
    id: string;
    createdAt: string;
    depositCoin: string;
    settleCoin: string;
    depositNetwork: string;
    settleNetwork: string;
    depositAddress: string;
    settleAddress: string;
    depositMin: string;
    depositMax: string;
    refundAddress?: string;
    refundMemo?: string;
    depositAmount: string;
    settleAmount?: string;
    type: 'fixed' | 'variable';
    expiresAt: string;
    status: string; // 'expired' | 'refund' | 'refunded' | 'settling' | 'settled' | 'waiting' | 'pending' 'processing' | 
    externalId?: string;
    updatedAt?: string;
    depositHash?: string;
    settleHash?: string;
    depositReceivedAt?: string;
    averageShiftSeconds: string;
    rate: string;
    issue?: string;
}

export interface FixedShiftData extends BaseShiftData {
    type: 'fixed';
    quoteId: string;
}
interface RefundedFixedShiftData extends FixedShiftData {
    status: 'refunded';
}

export interface SettledFixedShift extends FixedShiftData {
    status: 'settled';
}

export interface VariableShiftData extends BaseShiftData {
    type: 'variable';
    settleCoinNetworkFee?: string; // String representation of number
    networkFeeUsd?: string; // String representation of number
}

interface RefundedVariableShiftData extends VariableShiftData {
    status: 'refunded';
}

export interface SettledVariableShift extends VariableShiftData {
    status: 'settled';
}

interface Deposit {
    deposits: Array<{
        updatedAt: string;
        depositHash: string;
        settleHash?: string;
        depositReceivedAt: string;
        depositAmount: string;
        settleAmount?: string;
        rate?: string;
        status: string;
    }>;
}

interface MultipleFixedShiftData extends FixedShiftData {
    type: 'fixed';
    status: 'multiple';
    deposits: Deposit;
}

interface MultipleVariableShiftData extends VariableShiftData {
    type: 'variable';
    status: 'multiple';
    deposits: Deposit;
}

export type RefundData = RefundedFixedShiftData | RefundedVariableShiftData;

export type ShiftData = FixedShiftData | SettledFixedShift | VariableShiftData | SettledVariableShift | MultipleFixedShiftData | MultipleVariableShiftData | RefundedFixedShiftData | RefundedVariableShiftData;

export interface CheckoutData {
    id: string;
    settleCoin: string;
    settleNetwork: string;
    settleAddress: string;
    settleMemo?: string;
    settleAmount: string;
    updatedAt: string;
    createdAt: string;
    affiliateId: string;
    successUrl: string;
    cancelUrl: string;
    link?: string;
}

export interface PairData {
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  min: string;
  max: string;
  rate: string;
}