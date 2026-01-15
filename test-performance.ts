import { logPerformanceUseCase, getPerformanceLogsUseCase } from './src/core/di/CollaborationContext';
import { generateUseCase } from './src/core/di/GenerateContext';

async function testPerformance() {
  console.log('--- Testing Performance Logger ---');

  // 1. Generate a tweet to log
  const mockBrandProfile: any = {
    handle: 'test_creator',
    bio: 'Test bio',
    topics: ['AI'],
    tone: 'Professional'
  };

  console.log('1. Generating a tweet for logging...');
  const tweets = await generateUseCase.execute(mockBrandProfile, 'twitter');
  const targetTweet = tweets[0];

  // 2. Log High Performance
  console.log('2. Logging HIGH performance (10k impressions, 500 likes, 50 follows)...');
  const highLog = await logPerformanceUseCase.execute({
    draftId: targetTweet.id,
    content: targetTweet.content,
    platform: 'twitter',
    metrics: {
      impressions: 10000,
      likes: 500,
      retweets: 100,
      replies: 50,
      follows: 50
    },
    postedAt: new Date()
  });
  console.log(`Success Score: ${highLog.successScore.toFixed(1)} / 10`);

  // 3. Log Average Performance
  console.log('3. Logging AVERAGE performance (1k impressions, 20 likes, 2 follows)...');
  const lowLog = await logPerformanceUseCase.execute({
    draftId: targetTweet.id,
    content: targetTweet.content,
    platform: 'twitter',
    metrics: {
      impressions: 1000,
      likes: 20,
      retweets: 5,
      replies: 2,
      follows: 2
    },
    postedAt: new Date()
  });
  console.log(`Success Score: ${lowLog.successScore.toFixed(1)} / 10`);

  // 4. Verify Retrieval and Filtering
  console.log('4. Fetching all logs...');
  const allLogs = await getPerformanceLogsUseCase.execute();
  console.log(`Total logs: ${allLogs.length}`);

  console.log('5. Fetching HIGH performers (> 7)...');
  const highPerformers = await getPerformanceLogsUseCase.execute({ minScore: 7 });
  console.log(`High performers found: ${highPerformers.length}`);

  if (highPerformers.some((p: any) => p.id === highLog.id) && !highPerformers.some((p: any) => p.id === lowLog.id)) {
    console.log('✅ FILTERING SUCCESSFUL');
  } else {
    console.log('❌ FILTERING FAILED');
  }
}

// Running test
testPerformance().catch(console.error);
