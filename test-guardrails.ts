import { PostProcessor } from './src/core/ai/PostProcessor';
import { BrandProfile } from './src/types/entities';
import { GuardrailValidator } from './src/core/brand/GuardrailValidator';

async function testGuardrails() {
  const validator = new GuardrailValidator();
  const processor = new PostProcessor(validator);
  const profile: BrandProfile = {
    id: 'test',
    systemPrompt: '',
    voiceExamples: [],
    createdAt: new Date(),
    guardrails: {
      allowedTopics: ['Tech'],
      avoidTopics: ['Politics'], // Deliberate violation target
      tone: 'Professional',
      maxHashtags: 2,
      characterRange: [10, 280]
    }
  };

  const tweets = [
    'Tech is great! #ai #coding', // Valid
    'Politics is messy. #vote',   // Violates avoidTopic
    'This is a very very long tweet that should definitely trigger the length guardrail and get auto-corrected if possible but if it remains too long it should be rejected but wait I am just testing if the violation metadata comes back correctly.' 
  ];

  console.log('--- Processing Tweets ---');
  const results = await processor.process(tweets, profile);
  
  results.forEach((r, i) => {
    console.log(`Tweet ${i + 1}: "${r.content.substring(0, 30)}..."`);
    console.log(`Violations: ${JSON.stringify(r.violations)}`);
    console.log('---');
  });
}

testGuardrails();
