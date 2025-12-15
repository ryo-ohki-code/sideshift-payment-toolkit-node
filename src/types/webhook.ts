export interface WebhookDataItem {
    id: string;
    createdAt: string;
    updatedAt: string;
    targetUrl: string;
    enabled: boolean;
    errors ?: ErrorHookResponse;
}

export interface Webhook {
    initialized: boolean;
    data: CreateHookData;
    timestamp: string;
}

export interface CreateHookData {
    createHook: WebhookDataItem;
}

export interface DeleteHookResponse {
    deleteHook: boolean;
}

export interface ErrorHookResponse {
    errors: ErrorHookResponseItem[];
}

export interface ErrorHookResponseItem {
    errors: { message: string, extensions: any };
}

export interface WebhookResponse {
  meta: {
    hook: {
      id: string;
      createdAt: string;
      updatedAt: string;
      enabled: boolean;
      accountId: string;
      targetUrl: string;
    };
  };
  payload: {
    shiftId: string;
    status: string;
    txid: string;
  };
}

export interface WebhookManager {
    isInitialized: () => boolean;
    getWebhookData: () => CreateHookData | null;
    saveData: (data: CreateHookData) => void;
    deleteData: () => void;
}