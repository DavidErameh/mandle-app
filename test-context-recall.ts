import { logPerformanceUseCase } from './src/core/di/CollaborationContext';
import { generateUseCase } from './src/core/di/GenerateContext';
import { SQLiteService } from './src/core/database/sqlite';

async function testContextRecall() {
  console.log('--- Testing Context Recall (Feature 15) ---');

  // 1. Initialise DB (ensure tables exist)
  const db = SQLiteService.getDB();

  // 2. Setup mock performances for different topics
  console.log('1. Seeding mock high-performers for different topics...');

  // High performer for Topic A (AI)
  await logPerformanceUseCase.execute({
    content: 'AI is changing the world. Here is how...',
    platform: 'twitter',
    metrics: { impressions: 10000, likes: 500, retweets: 100, replies: 50, follows: 50 },
    postedAt: new Date(),
    tags: ['AI', 'Tech']
  });

  // High performer for Topic B (Productivity)
  await logPerformanceUseCase.execute({
    content: 'My 5-step productivity routine for peak performance.',
    platform: 'twitter',
    metrics: { impressions: 8000, likes: 400, retweets: 80, replies: 40, follows: 30 },
    postedAt: new Date(),
    tags: ['Productivity', 'Self-improvement']
  });

  // 3. Test Generation with Topic A (AI)
  console.log('\n2. Testing Generation with AI Topic...');
  const aiProfile: any = {
    handle: 'test_creator',
    bio: 'Tech enthusiast',
    topics: ['AI'],
    tone: 'Informative',
    guardrails: {
      allowedTopics: ['AI'],
      avoidTopics: [],
      tone: 'Informative',
      maxHashtags: 1,
      characterRange: [50, 280]
    },
    voiceExamples: ['AI is the future.'],
    systemPrompt: 'You are an AI expert.'
  };

  // We need to make sure the pillar has the right tags
  const tweetsAI = await generateUseCase.execute(aiProfile, 'twitter');
  console.log(`Generated ${tweetsAI.length} tweets.`);
  console.log(`First tweet inspiration: ${tweetsAI[0].inspiredBy}`);

  if (tweetsAI[0].inspiredBy?.includes('AI')) {
    console.log('✅ AI TOPIC RECALL SUCCESSFUL');
  } else {
    console.log('❌ AI TOPIC RECALL FAILED (or matched generic)');
  }

  // 4. Test Generation with Topic B (Productivity)
  console.log('\n3. Testing Generation with Productivity Topic...');
  const productivityProfile: any = {
    ...aiProfile,
    topics: ['Productivity'],
    guardrails: { ...aiProfile.guardrails, allowedTopics: ['Productivity'] },
    systemPrompt: 'You are a productivity guru.'
  };

  // We'd expect this to match the productivity log
  // Note: GenerateUseCase uses the active pillar from Repo, so we'd need to mock/ensure pillar tags
  // For this test, let's assume the ContextBuilder finds 'Productivity' in the high-performers

  const tweetsProd = await generateUseCase.execute(productivityProfile, 'twitter');
  console.log(`Generated ${tweetsProd.length} tweets.`);
  console.log(`First tweet inspiration: ${tweetsProd[0].inspiredBy}`);

  if (tweetsProd[0].inspiredBy?.includes('productivity')) {
    console.log('✅ PRODUCTIVITY TOPIC RECALL SUCCESSFUL');
  }
}

testContextRecall().catch(console.error);
