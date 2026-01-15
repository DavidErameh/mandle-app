export interface VersionProps {
  id?: string;
  draftId: string;
  content: string;
  author: 'creator' | 'assistant';
  timestamp?: Date;
  changeType: 'generated' | 'edited' | 'polished';
  parentVersion?: string;
}

export class Version {
  id: string;
  draftId: string;
  content: string;
  author: 'creator' | 'assistant';
  timestamp: Date;
  changeType: 'generated' | 'edited' | 'polished';
  parentVersion?: string;

  constructor(props: VersionProps) {
    this.id = props.id || crypto.randomUUID();
    this.draftId = props.draftId;
    this.content = props.content;
    this.author = props.author;
    this.timestamp = props.timestamp || new Date();
    this.changeType = props.changeType;
    this.parentVersion = props.parentVersion;
  }
}
