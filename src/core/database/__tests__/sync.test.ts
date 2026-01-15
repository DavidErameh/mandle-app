import { SyncService } from '../../database/sync';
import { SQLiteService } from '../../database/sqlite';
import { supabase } from '../../database/supabase';

// Mock the SQLite service and Supabase
jest.mock('../../database/sqlite');
jest.mock('../../database/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn()
    }
  }
}));

const mockedSQLiteService = {
  getDB: jest.fn()
};

const mockedSupabase = {
  from: jest.fn(),
  auth: {
    getSession: jest.fn()
  }
};

(SQLiteService as any).getDB = mockedSQLiteService.getDB;
(supabase as any) = mockedSupabase;

describe('SyncService', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      runAsync: jest.fn().mockResolvedValue(undefined),
      getAllAsync: jest.fn().mockResolvedValue([])
    };
    mockedSQLiteService.getDB.mockReturnValue(mockDb);
    mockedSupabase.from.mockReturnValue({
      upsert: jest.fn().mockResolvedValue({ error: null }),
      insert: jest.fn().mockResolvedValue({ error: null })
    });
    mockedSupabase.auth.getSession.mockResolvedValue({ data: { session: {} } });
    
    jest.clearAllMocks();
  });

  it('should validate table names', () => {
    expect((SyncService as any).isValidTableName('tweets')).toBe(true);
    expect((SyncService as any).isValidTableName('invalid_table')).toBe(false);
  });

  it('should queue action when sync is not possible', async () => {
    // Mock canSync to return false
    jest.spyOn(SyncService as any, 'canSync').mockResolvedValue(false);
    
    await SyncService.pushToCloud('tweets', { id: '1', content: 'test' }, 'upsert');
    
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.any(String), 'tweets', expect.any(String), 'upsert'])
    );
  });

  it('should sync data when online', async () => {
    // Mock canSync to return true
    jest.spyOn(SyncService as any, 'canSync').mockResolvedValue(true);
    
    await SyncService.pushToCloud('tweets', { id: '1', content: 'test' }, 'upsert');
    
    expect(mockedSupabase.from).toHaveBeenCalledWith('tweets');
  });

  it('should handle invalid table names', async () => {
    // Mock canSync to return true
    jest.spyOn(SyncService as any, 'canSync').mockResolvedValue(true);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    await SyncService.pushToCloud('invalid_table', { id: '1', content: 'test' }, 'upsert');
    
    expect(consoleSpy).toHaveBeenCalledWith('SyncService', 'Invalid table name: invalid_table');
    consoleSpy.mockRestore();
  });
});