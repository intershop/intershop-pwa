import { WithdrawalData } from './withdrawal.interface';
import { WithdrawalMapper } from './withdrawal.mapper';

describe('Withdrawal Mapper', () => {
  describe('fromData', () => {
    it('should map WithdrawalData to Withdrawal model', () => {
      const withdrawalData: WithdrawalData = {
        id: 'withdrawal-123',
        data: {
          orderDocumentNumber: 'ORDER-001',
          orderEmail: 'test@example.com',
          status: 'INITIAL',
        },
      };

      const withdrawal = WithdrawalMapper.fromData(withdrawalData);

      expect(withdrawal).toMatchInlineSnapshot(`
        {
          "id": "withdrawal-123",
          "orderDocumentNumber": "ORDER-001",
          "orderEmail": "test@example.com",
          "status": "INITIAL",
        }
      `);
    });

    it('should map WithdrawalData with all optional fields', () => {
      const withdrawalData: WithdrawalData = {
        id: 'withdrawal-456',
        data: {
          orderDocumentNumber: 'ORDER-002',
          orderEmail: 'customer@example.com',
          status: 'CREATED',
          confirmationEmail: 'confirm@example.com',
          name: 'John Doe',
        },
      };

      const withdrawal = WithdrawalMapper.fromData(withdrawalData);

      expect(withdrawal).toMatchInlineSnapshot(`
        {
          "confirmationEmail": "confirm@example.com",
          "id": "withdrawal-456",
          "name": "John Doe",
          "orderDocumentNumber": "ORDER-002",
          "orderEmail": "customer@example.com",
          "status": "CREATED",
        }
      `);
    });

    it('should throw error when payload is undefined', () => {
      expect(() => WithdrawalMapper.fromData(undefined)).toThrow(`'WithdrawalData' is required for the mapping`);
    });
  });
});
