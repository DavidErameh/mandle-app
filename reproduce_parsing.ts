
const parseTweets = (response: string, targetCount: number = 5): string[] => {
    // COPY OF THE LOGIC FROM AIOrchestrator.ts
    const tweets: string[] = [];
    const lines = response.split('\n');
    
    let currentTweet = '';
    let capture = false;

    for (const line of lines) {
      if (line.match(/^TWEET_\d+:/i)) {
        if (currentTweet) tweets.push(currentTweet.trim());
        currentTweet = line.replace(/^TWEET_\d+:\s*/i, '');
        capture = true;
      } else if (capture) {
        currentTweet += '\n' + line;
      }
    }
    if (currentTweet) tweets.push(currentTweet.trim());

    if (tweets.length === 0) {
      return response.split(/\n\n+/).filter(t => t.length > 20).slice(0, targetCount);
    }
    
    return tweets.slice(0, targetCount);
};

const runTest = (name: string, input: string) => {
    console.log(`\n--- TEST: ${name} ---`);
    const results = parseTweets(input);
    console.log(`Found ${results.length} tweets.`);
    results.forEach((t, i) => console.log(`[${i+1}] ${t.substring(0, 50)}...`));
};

// 1. Ideal Case
runTest('Ideal Format', `TWEET_1: This is tweet one.
TWEET_2: This is tweet two.
TWEET_3: This is tweet three.`);

// 2. Chatty Preamble
runTest('Chatty Preamble', `Here is your thread based on the note:

TWEET_1: First tweet here.
TWEET_2: Second tweet here.`);

// 3. Bold Format (Llama loves this)
runTest('Bold Tags', `**TWEET_1:** This is bolded.
**TWEET_2:** Another bold one.`);

// 4. Space variations
runTest('Space Variations', `TWEET 1: No underscore.
Match? No.
TWEET_2: Underscore matched.`);

// 5. No Tags, just paragraphs
runTest('Paragraphs', `This is just a paragraph 1.

This is paragraph 2.

Paragraph 3.`);
