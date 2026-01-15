export class ContentPillar {
  id: string;
  name: string;
  description: string;
  examples: string[];
  active: boolean;
  lastUsed?: Date;
  usageCount: number;
  createdAt: Date;

  constructor(data: Partial<ContentPillar>) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || '';
    this.description = data.description || '';
    this.examples = data.examples || [];
    this.active = data.active ?? true;
    this.lastUsed = data.lastUsed;
    this.usageCount = data.usageCount || 0;
    this.createdAt = data.createdAt || new Date();
  }
}
