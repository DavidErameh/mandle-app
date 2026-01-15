import { addCommentUseCase, getCommentsUseCase, resolveCommentUseCase } from './src/core/di/CollaborationContext';
import { generateUseCase } from './src/core/di/GenerateContext';

async function testComments() {
  console.log('--- Testing Comments/Feedback ---');

  // 1. Generate a tweet to comment on
  const mockBrandProfile: any = {
    handle: 'test_creator',
    bio: 'Test bio',
    topics: ['AI'],
    tone: 'Professional'
  };

  console.log('1. Generating a tweet for feedback...');
  const tweets = await generateUseCase.execute(mockBrandProfile, 'twitter');
  const targetId = tweets[0].id;

  // 2. Add a comment
  console.log('2. Adding a comment...');
  await addCommentUseCase.execute({
    draftId: targetId,
    content: 'Love this variation! @assistant can you make it punchier?',
    author: 'creator'
  });

  // 3. Add a second comment (Assistant mock)
  console.log('3. Adding an assistant reply...');
  await addCommentUseCase.execute({
    draftId: targetId,
    content: 'Sure! I have updated the version history with a punchier version.',
    author: 'assistant'
  });

  // 4. Fetch comments
  console.log('4. Fetching comments...');
  const comments = await getCommentsUseCase.execute(targetId);
  console.log(`Total comments found: ${comments.length}`);
  comments.forEach((c: any, i: number) => {
    console.log(`[${i + 1}] ${c.author.toUpperCase()}: "${c.content}" (Resolved: ${c.resolved})`);
  });

  // 5. Resolve a comment
  console.log('5. Resolving the first comment...');
  await resolveCommentUseCase.execute(comments[0].id, true);

  // 6. Verify resolution
  const updatedComments = await getCommentsUseCase.execute(targetId);
  if (updatedComments[0].resolved === true) {
    console.log('✅ RESOLVE SUCCESSFUL');
  } else {
    console.log('❌ RESOLVE FAILED');
  }
}

// Running test
testComments().catch(console.error);
