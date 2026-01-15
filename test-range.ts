import { ConnectAccountUseCase } from './src/features/inspiration/domain/useCases/ConnectAccountUseCase';
import { IInspirationRepository } from './src/features/inspiration/domain/interfaces/IInspirationRepository';

async function testRangeEnforcement() {
  const mockRepo: Partial<IInspirationRepository> = {
    getConnectedAccounts: async () => [
      { id: '1' } as any,
      { id: '2' } as any,
      { id: '3' } as any,
      { id: '4' } as any
    ],
    connectAccount: async () => ({ id: '5' } as any)
  };

  const useCase = new ConnectAccountUseCase(mockRepo as IInspirationRepository);

  console.log('--- Testing Max Limit (4) ---');
  try {
    await useCase.execute('twitter', 'test');
    console.log('FAIL: Allowed adding 5th account');
  } catch (e: any) {
    console.log('SUCCESS: Blocked 5th account with message:', e.message);
  }
}

testRangeEnforcement();
