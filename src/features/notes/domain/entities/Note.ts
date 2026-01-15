export interface NoteProps {
  id: string;
  content: string;
  tags: string[];
  state: 'draft' | 'ready' | 'generated' | 'posted' | 'archived';
  pillarId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Note {
  id: string;
  content: string;
  tags: string[];
  state: 'draft' | 'ready' | 'generated' | 'posted' | 'archived';
  pillarId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<NoteProps>) {
    this.id = data.id || crypto.randomUUID();
    this.content = data.content || '';
    this.tags = data.tags || [];
    this.state = data.state || 'draft';
    this.pillarId = data.pillarId;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
