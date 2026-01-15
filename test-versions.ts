import { getVersionHistoryUseCase, saveVersionUseCase, restoreVersionUseCase } from './src/core/di/CollaborationContext';
import { generateUseCase } from './src/core/di/GenerateContext';
import { Tweet } from './src/features/generate/domain/entities/Tweet';

async function testVersionHistory() {
  console.log('--- Testing Version History ---');

  // 1. Mock a generation context
  const mockBrandProfile: any = {
    handle: 'test_creator',
    bio: 'Test bio',
    topics: ['AI'],
    tone: 'Professional'
  };

  console.log('1. Generating tweets (should trigger Version 0)...');
  const tweets = await generateUseCase.execute(mockBrandProfile, 'twitter');
  const targetId = tweets[0].id;

  // 2. Check initial history
  console.log('2. Checking initial version history...');
  const history1 = await getVersionHistoryUseCase.execute(targetId);
  console.log(`Initial versions count: ${history1.length}`);
  if (history1.length > 0) {
    console.log(`Initial version content: "${history1[0].content}"`);
    console.log(`Initial version author: ${history1[0].author}`);
  }

  // 3. Record a manual edit (Creator)
  console.log('3. Recording a manual edit...');
  const editedContent = 'This is an edited version of the AI tweet.';
  await saveVersionUseCase.execute({
    draftId: targetId,
    content: editedContent,
    author: 'creator',
    changeType: 'edited'
  });

  // 4. Check history again
  const history2 = await getVersionHistoryUseCase.execute(targetId);
  console.log(`Updated versions count: ${history2.length}`);
  console.log(`Latest version content: "${history2[0].content}"`);
  console.log(`Latest version author: ${history2[0].author}`);

  // 5. Test Restore
  console.log('5. Restoring to original Version 0...');
  const originalVersion = history2[history2.length - 1];
  await restoreVersionUseCase.execute(originalVersion);

  // 6. Verify restoration
  const history3 = await getVersionHistoryUseCase.execute(targetId);
  console.log(`Final versions count (restoration node added): ${history3.length}`);
  console.log(`Current content after restore (from latest version): "${history3[0].content}"`);

  if (history3[0].content === originalVersion.content) {
    console.log('✅ RESTORE SUCCESSFUL');
  } else {
    console.log('❌ RESTORE FAILED');
  }
}

// Running test
testVersionHistory().catch(console.error);
