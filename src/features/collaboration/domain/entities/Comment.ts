import { generateUUID } from '@/shared/utils/validation';

export interface CommentProps {
  id?: string;
  draftId: string;
  content: string;
  author: 'creator' | 'assistant';
  resolved?: boolean;
  createdAt?: Date;
}

export class Comment {
  id: string;
  draftId: string;
  content: string;
  author: 'creator' | 'assistant';
  resolved: boolean;
  createdAt: Date;

  constructor(props: CommentProps) {
    this.id = props.id || generateUUID();
    this.draftId = props.draftId;
    this.content = props.content;
    this.author = props.author;
    this.resolved = props.resolved || false;
    this.createdAt = props.createdAt || new Date();
  }

  toggleResolved() {
    this.resolved = !this.resolved;
  }
}
