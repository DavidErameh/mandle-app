export type ViralPattern = {
  name: string;
  description: string;
  intensity: 'low' | 'medium' | 'high';
};

export type DetailedAnalysis = {
  hookType: 'Question' | 'Statement' | 'Static' | 'Story' | 'Data';
  structure: 'List' | 'Narrative' | 'Tutorial' | 'Hot-take' | 'Direct';
  emotion: 'Curiosity' | 'Urgency' | 'Aspiration' | 'Relatability' | 'Neutral';
  ctaType: 'Follow' | 'Reply' | 'Click' | 'Action' | 'None';
};

export class PatternExtractor {
  extract(content: string): ViralPattern {
    const text = content.trim();
    const result = this.analyzeContent(text);

    return {
      name: `${result.hookType} Hook / ${result.structure}`,
      description: `Targeting ${result.emotion} through a ${result.structure.toLowerCase()} format.`,
      intensity: result.emotion === 'Urgency' || result.hookType === 'Data' ? 'high' : 'medium'
    };
  }

  analyzeContent(content: string): DetailedAnalysis {
    const text = content.trim();
    const firstLine = text.split('\n')[0].toLowerCase();
    
    // 1. Hook Type
    let hookType: DetailedAnalysis['hookType'] = 'Statement';
    if (firstLine.includes('?')) hookType = 'Question';
    else if (/\d+%|\$\d+|every \d+/i.test(firstLine)) hookType = 'Data';
    else if (/i was|years ago|started at/i.test(firstLine)) hookType = 'Story';
    else if (firstLine.length < 50 && !firstLine.includes(' ')) hookType = 'Static';

    // 2. Structure
    let structure: DetailedAnalysis['structure'] = 'Direct';
    const lines = text.split('\n');
    if (lines.filter(l => /^\d+\.|\-|\•/.test(l.trim())).length >= 3) structure = 'List';
    else if (text.includes('how to') || text.includes('step ')) structure = 'Tutorial';
    else if (text.length > 200 && lines.length > 5) structure = 'Narrative';
    else if (text.includes('unpopular opinion') || text.includes('stop doing')) structure = 'Hot-take';

    // 3. Emotion
    let emotion: DetailedAnalysis['emotion'] = 'Neutral';
    if (text.includes('?') || text.includes('revealed')) emotion = 'Curiosity';
    else if (text.includes('now') || text.includes('last chance') || text.includes('stop')) emotion = 'Urgency';
    else if (text.includes('dream') || text.includes('million') || text.includes('freedom')) emotion = 'Aspiration';
    else if (text.includes('ever feel') || text.includes('i also')) emotion = 'Relatability';

    // 4. CTA Type
    let ctaType: DetailedAnalysis['ctaType'] = 'None';
    const lastLine = lines[lines.length - 1].toLowerCase();
    if (lastLine.includes('follow') || lastLine.includes('subscribe')) ctaType = 'Follow';
    else if (lastLine.includes('reply') || lastLine.includes('comment')) ctaType = 'Reply';
    else if (lastLine.includes('http') || lastLine.includes('link') || lastLine.includes('.com')) ctaType = 'Click';
    else if (lastLine.includes('do this') || lastLine.includes('start')) ctaType = 'Action';

    return { hookType, structure, emotion, ctaType };
  }
}
