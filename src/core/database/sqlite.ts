import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mandle.db');

export class SQLiteService {
  static async init() {
    try {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        
        CREATE TABLE IF NOT EXISTS content_pillars (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          examples TEXT, -- JSON
          active INTEGER DEFAULT 1,
          last_used TEXT,
          usage_count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          tags TEXT, -- JSON
          state TEXT DEFAULT 'draft', -- draft, ready, generated, posted, archived
          pillar_id TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT,
          FOREIGN KEY (pillar_id) REFERENCES content_pillars (id) ON DELETE SET NULL
        );


        CREATE TABLE IF NOT EXISTS connected_accounts (
          id TEXT PRIMARY KEY,
          account_name TEXT NOT NULL,
          platform TEXT,
          avatar_url TEXT,
          viral_score REAL,
          patterns TEXT, -- JSON
          last_fetched TEXT
        );

        CREATE TABLE IF NOT EXISTS generated_tweets (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          variant INTEGER,
          original_prompt TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'draft' -- draft, saved, posted
        );

        CREATE TABLE IF NOT EXISTS brand_profile (
          id TEXT PRIMARY KEY,
          system_prompt TEXT,
          guardrails TEXT, -- JSON
          voice_examples TEXT, -- JSON
          voice_analysis TEXT, -- JSON
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS viral_inspirations (
          id TEXT PRIMARY KEY,
          account_id TEXT,
          content TEXT NOT NULL,
          engagement_count INTEGER,
          platform TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (account_id) REFERENCES connected_accounts (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS manual_inspirations (
          id TEXT PRIMARY KEY,
          url TEXT,
          content TEXT NOT NULL,
          analysis TEXT, -- JSON
          variations TEXT, -- JSON
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS draft_comments (
          id TEXT PRIMARY KEY,
          draft_id TEXT NOT NULL,
          content TEXT NOT NULL,
          author TEXT NOT NULL,
          resolved INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (draft_id) REFERENCES generated_tweets (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS performance_logs (
          id TEXT PRIMARY KEY,
          draft_id TEXT,
          content TEXT NOT NULL,
          platform TEXT,
          impressions INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          retweets INTEGER DEFAULT 0,
          replies INTEGER DEFAULT 0,
          follows INTEGER DEFAULT 0,
          clicks INTEGER,
          success_score REAL,
          tags TEXT,
          posted_at TEXT,
          created_at TEXT,
          FOREIGN KEY (draft_id) REFERENCES generated_tweets (id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS viral_patterns (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          hook_type TEXT,
          structure TEXT,
          emotion TEXT,
          cta_type TEXT,
          intensity TEXT,
          source_tweet_id TEXT,
          created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS versions (
          id TEXT PRIMARY KEY,
          draft_id TEXT,
          content TEXT NOT NULL,
          author TEXT, -- creator, assistant
          timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
          change_type TEXT, -- generated, edited, polished
          parent_version TEXT,
          FOREIGN KEY (draft_id) REFERENCES generated_tweets (id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS app_logs (
          id TEXT PRIMARY KEY,
          level TEXT NOT NULL,
          module TEXT NOT NULL,
          message TEXT NOT NULL,
          stack_trace TEXT,
          data TEXT, -- JSON data for additional context
          timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sync_queue (
          id TEXT PRIMARY KEY,
          table_name TEXT NOT NULL,
          data TEXT NOT NULL, -- JSON
          operation TEXT NOT NULL, -- insert, upsert, delete
          attempts INTEGER DEFAULT 0,
          last_attempt TEXT,
          next_retry TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        -- Indexes for performance optimization
        CREATE INDEX IF NOT EXISTS idx_notes_state ON notes(state);
        CREATE INDEX IF NOT EXISTS idx_notes_pillar_id ON notes(pillar_id);
        CREATE INDEX IF NOT EXISTS idx_generated_tweets_status ON generated_tweets(status);
        CREATE INDEX IF NOT EXISTS idx_draft_comments_draft_id ON draft_comments(draft_id);
        CREATE INDEX IF NOT EXISTS idx_performance_logs_draft_id ON performance_logs(draft_id);
        CREATE INDEX IF NOT EXISTS idx_performance_logs_success_score ON performance_logs(success_score);
        CREATE INDEX IF NOT EXISTS idx_versions_draft_id ON versions(draft_id);
        CREATE INDEX IF NOT EXISTS idx_sync_queue_next_retry ON sync_queue(next_retry);
        CREATE INDEX IF NOT EXISTS idx_sync_queue_attempts ON sync_queue(attempts);
        CREATE INDEX IF NOT EXISTS idx_content_pillars_active ON content_pillars(active);
        CREATE INDEX IF NOT EXISTS idx_connected_accounts_platform ON connected_accounts(platform);
        CREATE INDEX IF NOT EXISTS idx_viral_inspirations_account_id ON viral_inspirations(account_id);
        CREATE INDEX IF NOT EXISTS idx_viral_inspirations_engagement_count ON viral_inspirations(engagement_count);
      `);
      console.log('SQLite initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SQLite:', error);
      throw error;
    }
  }

  static getDB() {
    return db;
  }
}
