import { generateUUID } from '@/shared/utils/validation';

export type ViralPatternIntensity = 'low' | 'medium' | 'high';

export interface ViralPatternProps {
  id?: string;
  name: string;
  description: string;
  hookType: string;
  structure: string;
  emotion: string;
  ctaType: string;
  intensity?: ViralPatternIntensity;
  sourceTweetId?: string;
  createdAt?: Date;
}

export class ViralPattern {
  id: string;
  name: string;
  description: string;
  hookType: string;
  structure: string;
  emotion: string;
  ctaType: string;
  intensity: ViralPatternIntensity;
  sourceTweetId?: string;
  createdAt: Date;

  constructor(props: ViralPatternProps) {
    this.id = props.id || generateUUID();
    this.name = props.name;
    this.description = props.description;
    this.hookType = props.hookType;
    this.structure = props.structure;
    this.emotion = props.emotion;
    this.ctaType = props.ctaType;
    this.intensity = props.intensity || 'medium';
    this.sourceTweetId = props.sourceTweetId;
    this.createdAt = props.createdAt || new Date();
  }
}
