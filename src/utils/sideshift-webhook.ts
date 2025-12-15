// Interfaces
import { CreateHookData, DeleteHookResponse, WebhookDataItem } from './../types/webhook'

// Webhook Manager
import webhookManager from './webhook-manager';

async function createNewWebhook(WEBSITE_URL: string, SIDESHIFT_SECRET: string): Promise<CreateHookData> {
    const url: string = 'https://sideshift.ai/graphql';
    const secretKey: string = SIDESHIFT_SECRET;
    const targetUrl: string = `${WEBSITE_URL}/api/webhooks/sideshift`;

    const payload = {
        query: `mutation { createHook(targetUrl: "${targetUrl}") { id createdAt updatedAt targetUrl enabled } }`
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-sideshift-secret': secretKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('[WebhookManager] Webhook connection success:', result);

        return result as CreateHookData;
    } catch (error) {
        console.error('[WebhookManager] Error:', error);
        throw error;
    }
}

export async function _deleteWebhook(SIDESHIFT_SECRET: string): Promise<DeleteHookResponse> {
    const url: string = 'https://sideshift.ai/graphql';
    const secretKey: string = SIDESHIFT_SECRET;
    const hook: WebhookDataItem | null = webhookManager.getWebhookData();
    let hookId: string;

    if (hook) {
        hookId = hook?.id;
        const payload = {
            query: `mutation { deleteHook(id: "${hookId}") }`
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sideshift-secret': secretKey
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            webhookManager.deleteData();
            
            console.log('[WebhookManager] Webhook connection successfully deleted:', result);
            return result as DeleteHookResponse;
        } catch (error) {
            console.error('[WebhookManager] Error:', error);
            throw error;
        }
    } else {
        return { deleteHook: false };
    }
}

export async function _setupSideShiftWebhook(WEBSITE_URL: string, SIDESHIFT_SECRET: string): Promise<CreateHookData> {
    if (webhookManager.isInitialized()) {
        console.log('[WebhookManager] Webhook already initialized');
        const existingData: WebhookDataItem |null = webhookManager.getWebhookData();
        if (existingData) {
            console.log('[WebhookManager] Existing webhook data:', existingData);
            return {
                createHook: existingData
            };
        }

    }

    // Create new webhook
    const webhookData: CreateHookData = await createNewWebhook(WEBSITE_URL, SIDESHIFT_SECRET);

    // Save the webhook
    webhookManager.saveData(webhookData);

    return webhookData;
}

export function _getWebhookId(): string | null{
    const webhookData: WebhookDataItem |null = webhookManager.getWebhookData();
    if(!webhookData){
        return null
    }else{
        return webhookData.id;
    }
}