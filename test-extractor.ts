import { PatternExtractor } from './src/features/inspiration/../../core/ai/PatternExtractor';

function testExtractor() {
  const extractor = new PatternExtractor();
  
  const testCases = [
    {
      name: "Listicle with Question",
      content: "Why are you still working 40 hours?\n\n1. AI is here\n2. Automation is ease\n3. Leverage is key\n\nFollow for more."
    },
    {
      name: "Data with Urgency",
      content: "99% of creators fail because they don't have a system.\n\nStop wasting time. Start tonight.\n\nClick the link in bio."
    },
    {
      name: "Story with Relatability",
      content: "I started at $0 3 years ago.\n\nI also felt like giving up every single day.\n\nBut I kept going. Reply if you feel this."
    }
  ];

  testCases.forEach(tc => {
    console.log(`--- Testing: ${tc.name} ---`);
    const result = extractor.analyzeContent(tc.content);
    console.log(JSON.stringify(result, null, 2));
  });
}

testExtractor();
