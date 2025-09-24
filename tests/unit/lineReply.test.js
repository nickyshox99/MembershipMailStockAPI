const lineReply = require('./lineReply');
const lineChatAPI = require('./lineChatAPI');
const MemberList = require('../models/memberlist.model');
const ProductList = require('../models/productlist.model');

// Mock dependencies
jest.mock('./lineChatAPI', () => ({
  replyMessage: jest.fn()
}));
jest.mock('../models/memberlist.model', () => ({
  getUserByLineSourceId: jest.fn()
}));
jest.mock('../models/productlist.model', () => ({
  GetDayExpireByUserId: jest.fn()
}));

describe('lineReply Module', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('handleRegistration', () => {
    it('should send registration link message', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const sourceUserId = 'test_user_id';
      const oSecretkey = { webDomain: 'https://example.com/' };
      
      // Act
      await lineReply.handleRegistration(reply_token, sourceUserId, oSecretkey);
      
      // Assert
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'เปิดลิงค์นี้เพื่อทำการสมัคร https://example.com/registeremail?sourceUserId=test_user_id'
      );
    });

    it('should handle empty webDomain', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const sourceUserId = 'test_user_id';
      const oSecretkey = { webDomain: '' };
      
      // Act
      await lineReply.handleRegistration(reply_token, sourceUserId, oSecretkey);
      
      // Assert
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'เปิดลิงค์นี้เพื่อทำการสมัคร registeremail?sourceUserId=test_user_id'
      );
    });
  });

  describe('handleRenewalOrPurchase', () => {
    it('should send purchase link when user exists', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      const oSecretkey = { webDomain: 'https://example.com/' };
      const mockUserList = [{ id: 1, email: 'test@example.com' }];
      
      MemberList.getUserByLineSourceId.mockResolvedValue(mockUserList);
      
      // Act
      await lineReply.handleRenewalOrPurchase(reply_token, profileData, oSecretkey);
      
      // Assert
      expect(MemberList.getUserByLineSourceId).toHaveBeenCalledWith('test_user_id');
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'เปิดลิงค์นี้เพื่อทำการซื้อ https://example.com/buyproduct?sourceUserId=test_user_id'
      );
    });

    it('should send registration message when user does not exist', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      const oSecretkey = { webDomain: 'https://example.com/' };
      
      MemberList.getUserByLineSourceId.mockResolvedValue([]);
      
      // Act
      await lineReply.handleRenewalOrPurchase(reply_token, profileData, oSecretkey);
      
      // Assert
      expect(MemberList.getUserByLineSourceId).toHaveBeenCalledWith('test_user_id');
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม'
      );
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      const oSecretkey = { webDomain: 'https://example.com/' };
      
      MemberList.getUserByLineSourceId.mockRejectedValue(new Error('Database error'));
      
      // Act & Assert
      await expect(lineReply.handleRenewalOrPurchase(reply_token, profileData, oSecretkey))
        .rejects.toThrow('Database error');
    });
  });

  describe('handleCheckDays', () => {
    it('should send product expiration info when user has products', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      const mockUserList = [{ id: 1, email: 'test@example.com' }];
      const mockProducts = [
        {
          email: 'test@example.com',
          end_date: '2024-12-31',
          subscription_name: 'YouTube Premium',
          days_left: 30
        },
        {
          email: 'test@example.com',
          end_date: '2024-11-15',
          subscription_name: 'Netflix',
          days_left: -5
        }
      ];
      
      MemberList.getUserByLineSourceId.mockResolvedValue(mockUserList);
      ProductList.GetDayExpireByUserId.mockResolvedValue(mockProducts);
      
      // Act
      await lineReply.handleCheckDays(reply_token, profileData);
      
      // Assert
      expect(MemberList.getUserByLineSourceId).toHaveBeenCalledWith('test_user_id');
      expect(ProductList.GetDayExpireByUserId).toHaveBeenCalledWith(1);
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'test@example.com หมดอายุวันที่ 2024-12-31YouTube Premium เหลือ 30 วัน\n' +
        'test@example.com หมดอายุวันที่ 2024-11-15Netflix หมดอายุ \n'
      );
    });

    it('should send "ไม่มีข้อมูล" when user has no products', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      const mockUserList = [{ id: 1, email: 'test@example.com' }];
      
      MemberList.getUserByLineSourceId.mockResolvedValue(mockUserList);
      ProductList.GetDayExpireByUserId.mockResolvedValue([]);
      
      // Act
      await lineReply.handleCheckDays(reply_token, profileData);
      
      // Assert
      expect(MemberList.getUserByLineSourceId).toHaveBeenCalledWith('test_user_id');
      expect(ProductList.GetDayExpireByUserId).toHaveBeenCalledWith(1);
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'ไม่มีข้อมูล'
      );
    });

    it('should send registration message when user does not exist', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      
      MemberList.getUserByLineSourceId.mockResolvedValue([]);
      
      // Act
      await lineReply.handleCheckDays(reply_token, profileData);
      
      // Assert
      expect(MemberList.getUserByLineSourceId).toHaveBeenCalledWith('test_user_id');
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม'
      );
    });

    it('should handle database error gracefully', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      
      MemberList.getUserByLineSourceId.mockRejectedValue(new Error('Database error'));
      
      // Act & Assert
      await expect(lineReply.handleCheckDays(reply_token, profileData))
        .rejects.toThrow('Database error');
    });
  });

  describe('handleDefaultMessage', () => {
    it('should send default help message', () => {
      // Arrange
      const reply_token = 'test_reply_token';
      
      // Act
      lineReply.handleDefaultMessage(reply_token);
      
      // Assert
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'พิมพ์คำสั่ง เช่น "สมัคร", "ต่ออายุ", "ซื้อ", "เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม'
      );
    });

    it('should be synchronous function', () => {
      // Arrange
      const reply_token = 'test_reply_token';
      
      // Act
      const result = lineReply.handleDefaultMessage(reply_token);
      
      // Assert
      expect(result).toBeUndefined(); // Should not return a promise
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        reply_token,
        'พิมพ์คำสั่ง เช่น "สมัคร", "ต่ออายุ", "ซื้อ", "เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม'
      );
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete flow for existing user with products', async () => {
      // Arrange
      const reply_token = 'test_reply_token';
      const profileData = { user_id: 'test_user_id' };
      const oSecretkey = { webDomain: 'https://example.com/' };
      const mockUserList = [{ id: 1, email: 'test@example.com' }];
      const mockProducts = [
        {
          email: 'test@example.com',
          end_date: '2024-12-31',
          subscription_name: 'YouTube Premium',
          days_left: 30
        }
      ];
      
      MemberList.getUserByLineSourceId.mockResolvedValue(mockUserList);
      ProductList.GetDayExpireByUserId.mockResolvedValue(mockProducts);
      
      // Act - Test multiple functions
      await lineReply.handleRenewalOrPurchase(reply_token, profileData, oSecretkey);
      await lineReply.handleCheckDays(reply_token, profileData);
      
      // Assert
      expect(MemberList.getUserByLineSourceId).toHaveBeenCalledTimes(2);
      expect(lineChatAPI.replyMessage).toHaveBeenCalledTimes(2);
    });
  });
});
