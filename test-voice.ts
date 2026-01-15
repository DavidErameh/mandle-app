import { VoiceAnalyzer } from './src/core/ai/VoiceAnalyzer';

function testVoiceAnalyzer() {
  const analyzer = new VoiceAnalyzer();
  const examples = [
    "AI is the future. We must build better tools. Code is logic.",
    "Do you feel the shift? I believe human journeys matter most.",
    "Stop wasting time. Data shows 99% fail here. Never give up!",
    "This is 🚀 awesome! Love these guys! 🎉"
  ];

  console.log('--- Analyzing Voice ---');
  const analysis = analyzer.analyze(examples);
  console.log(JSON.stringify(analysis, null, 2));
}

testVoiceAnalyzer();
