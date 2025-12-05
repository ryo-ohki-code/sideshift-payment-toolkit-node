export interface WebhookData {
  id: string;
  createdAt: string;
  updatedAt: string;
  targetUrl: string;
  enabled: boolean;
  errors?: ErrorHookResponse;
}

export interface WebhookStatus {
  initialized: boolean;
  data: any;
  timestamp: string;
}

export interface CreateHookResponse {
  createHook: WebhookData;
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

export interface WebhookManager {
  isInitialized: () => boolean;
  getWebhookData: () => CreateHookResponse | null;
  saveData: (data: CreateHookResponse) => void;
  deleteData: () => void;
}
