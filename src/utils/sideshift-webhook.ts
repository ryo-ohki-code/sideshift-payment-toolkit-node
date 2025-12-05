// Interfaces
import { CreateHookResponse, DeleteHookResponse, WebhookManager } from './../types/webhook'

import webhookManager from './webhook-manager';


async function createNewWebhook(WEBSITE_URL: string, SIDESHIFT_SECRET: string): Promise<CreateHookResponse> {
    const url = 'https://sideshift.ai/graphql';
    const secretKey = SIDESHIFT_SECRET;
    const targetUrl = `${WEBSITE_URL}/api/webhooks/sideshift`;

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
        console.log('Webhook connection success:', result);

        return result as CreateHookResponse;
        // return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function _deleteWebhook(SIDESHIFT_SECRET: string): Promise<DeleteHookResponse> {
    const url = 'https://sideshift.ai/graphql';
    const secretKey = SIDESHIFT_SECRET;
    const hook = webhookManager.getWebhookData();
    let hookId: string;
    if (hook) {
        hookId = hook.id;
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
            
            console.log('Webhook connection successfully deleted:', result);
            return result as DeleteHookResponse;
            // return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    } else {
        return { deleteHook: false };
    }


}

export async function _setupSideShiftWebhook(WEBSITE_URL: string, SIDESHIFT_SECRET: string): Promise<CreateHookResponse> {
    if (webhookManager.isInitialized()) {
        console.log('Webhook already initialized');
        const existingData = webhookManager.getWebhookData();
        if (existingData) {
            console.log('Existing webhook data:', existingData);
            return {
                createHook: existingData
            };
        }

    }

    // Create new webhook
    const webhookData = await createNewWebhook(WEBSITE_URL, SIDESHIFT_SECRET);

    // Save the webhook
    webhookManager.saveData(webhookData);

    return webhookData;
}