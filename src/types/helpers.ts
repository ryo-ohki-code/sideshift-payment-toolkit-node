export interface IPInfo {
    full: string;
    type: string | null;
    address: string | null;
};


interface TokenDetails {
    network: NetworkDetails;
}

interface NetworkDetails {
    contractAddress: string;
    decimals: number;
}

export interface RawCoinListItem {
    networks: string[];
    coin: string;
    mainnet: string;
    name: string;
    hasMemo: boolean;
    fixedOnly: string[] | boolean;
    variableOnly: string[] | boolean;
    tokenDetails: TokenDetails;
    networksWithMemo: string[];
    depositOffline: string[] | boolean;
    settleOffline: string[] | boolean;
    chain: string;
}
