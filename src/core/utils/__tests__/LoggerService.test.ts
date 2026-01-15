import { LoggerService } from '../../utils/LoggerService';
import { SQLiteService } from '../../database/sqlite';

// Mock the SQLite service
jest.mock('../../database/sqlite');

const mockedSQLiteService = {
  getDB: jest.fn()
};

(SQLiteService as any).getDB = mockedSQLiteService.getDB;

describe('LoggerService', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      runAsync: jest.fn().mockResolvedValue(undefined),
      getAllAsync: jest.fn().mockResolvedValue([])
    };
    mockedSQLiteService.getDB.mockReturnValue(mockDb);
    jest.clearAllMocks();
  });

  it('should log info message', async () => {
    await LoggerService.info('TestModule', 'Test message');
    
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.any(String), 'info', 'TestModule', 'Test message', null, null])
    );
  });

  it('should log error with stack trace', async () => {
    const error = new Error('Test error');
    await LoggerService.error('TestModule', 'Test error message', error);
    
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.any(String), 'error', 'TestModule', 'Test error message', expect.stringContaining('Error: Test error'), null])
    );
  });

  it('should truncate long messages', async () => {
    const longMessage = 'A'.repeat(11000); // Exceeds the 10000 limit
    await LoggerService.error('TestModule', longMessage);
    
    const callArgs = mockDb.runAsync.mock.calls[0];
    const messageArg = callArgs[1][3]; // The message is the 4th parameter
    
    expect(messageArg).toContain('[TRUNCATED]');
    expect(messageArg.length).toBeLessThan(longMessage.length);
  });

  it('should handle database errors gracefully', async () => {
    mockDb.runAsync.mockRejectedValueOnce(new Error('DB Error'));
    
    // Capture console.error calls
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    await LoggerService.info('TestModule', 'Test message');
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to persist log to SQLite:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should log with additional data', async () => {
    const additionalData = { userId: '123', action: 'login' };
    await LoggerService.info('TestModule', 'Test message', additionalData);
    
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([expect.any(String), 'info', 'TestModule', 'Test message', null, JSON.stringify(additionalData)])
    );
  });
});