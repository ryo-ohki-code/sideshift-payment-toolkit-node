import { Webhook, WebhookDataItem } from './../types/webhook';
import fs from 'fs';


class WebhookManager {
  // private listFile: string;
  private webhookFile: string;

  constructor() {
    // this.listFile = new URL('./webhook-list.json', import.meta.url).pathname;
    this.webhookFile = new URL('./webhook-file.json', import.meta.url).pathname;
  }

  saveData(data: any): void {
    try {
      const statusData: Webhook = {
        initialized: true,
        data: data.data || data,
        timestamp: new Date().toISOString()
      };

      // Save list of all created webhook Ids
      // let wehbookIds: string[];
      // if (!fs.existsSync(this.listFile)) {
      //   wehbookIds = [];
      // } else{
      //   let wehbookIds_ = fs.readFileSync(this.listFile, 'utf8');
      //   wehbookIds = JSON.parse(wehbookIds_);
      // }
      // if(data && data.data.id) wehbookIds.push(data.data.id);
      // fs.writeFileSync(this.listFile, JSON.stringify(wehbookIds, null, 2));

      // Save the webhook data
      fs.writeFileSync(this.webhookFile, JSON.stringify(statusData, null, 2));
      console.log('[WebhookManager] Webhook status saved successfully');
    } catch (error) {
      console.error('[WebhookManager] Failed to save webhook status:', error);
      throw error;
    }
  }

  deleteData(): void {
    try {
      fs.writeFileSync(this.webhookFile, JSON.stringify({}, null, 2));
    } catch (error) {
      console.error('[WebhookManager] Failed to save webhook status:', error);
      throw error;
    }
  }

  getData(): Webhook | null {
    try {
      if (!fs.existsSync(this.webhookFile)) {
        return null;
      }

      const data = fs.readFileSync(this.webhookFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('[WebhookManager] Failed to read webhook status:', error);
      return null;
    }
  }

  isInitialized(): boolean {
    const status = this.getData();
    return status !== null && status.initialized;
  }

  getWebhookData(): WebhookDataItem | null {
    const status = this.getData();
    return status ? status.data.createHook : null;
  }
}

export default new WebhookManager();
