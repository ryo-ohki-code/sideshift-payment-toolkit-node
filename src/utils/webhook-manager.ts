import { WebhookData, WebhookStatus } from './../types/webhook';
import fs from 'fs';


class WebhookManager {
  private statusFile: string;

  constructor() {
    this.statusFile = new URL('./webhook-status.json', import.meta.url).pathname;
  }

  saveData(data: any): void {
    try {
      const statusData: WebhookStatus = {
        initialized: true,
        data: data.data || data,
        timestamp: new Date().toISOString()
      };

      fs.writeFileSync(this.statusFile, JSON.stringify(statusData, null, 2));
      console.log('Webhook status saved successfully');
    } catch (error) {
      console.error('Failed to save webhook status:', error);
      throw error;
    }
  }

  deleteData(): void {
    try {
      fs.writeFileSync(this.statusFile, JSON.stringify({}, null, 2));
    } catch (error) {
      console.error('Failed to save webhook status:', error);
      throw error;
    }
  }

  getData(): WebhookStatus | null {
    try {
      if (!fs.existsSync(this.statusFile)) {
        return null;
      }

      const data = fs.readFileSync(this.statusFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read webhook status:', error);
      return null;
    }
  }

  isInitialized(): boolean {
    const status = this.getData();
    return status !== null && status.initialized;
  }

  getWebhookData(): WebhookData | null {
    const status = this.getData();
    return status ? status.data : null;
  }
}

export default new WebhookManager();
