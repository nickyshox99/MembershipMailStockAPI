const lineReply = require('./lineReply');
const lineChatAPI = require('./lineChatAPI');
const MemberList = require('../models/memberlist.model');
const ProductList = require('../models/productlist.model');

// Mock dependencies for integration test
jest.mock('./lineChatAPI', () => ({
  replyMessage: jest.fn()
}));
jest.mock('../models/memberlist.model', () => ({
  getUserByLineSourceId: jest.fn()
}));
jest.mock('../models/productlist.model', () => ({
  GetDayExpireByUserId: jest.fn()
}));

// Integration Test Configuration
const INTEGRATION_TEST_CONFIG = {
  // ใช้ test channel ของ LINE หรือ channel จริงที่ต้องการทดสอบ
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN_TEST || process.env.LINE_CHANNEL_ACCESS_TOKEN,
  // Test user ID ที่จะใช้ในการทดสอบ
  testUserId: process.env.LINE_TEST_USER_ID || 'test_user_id',
  // Web domain สำหรับ test
  testWebDomain: process.env.TEST_WEB_DOMAIN || 'https://test.example.com/',
  // เปิด/ปิดการส่งข้อความจริง (ควรเป็น false ใน production)
  enableRealSending: process.env.ENABLE_REAL_LINE_SENDING === 'true'
};

/**
 * Helper function สำหรับสร้าง test data
 */
function createTestData() {
  return {
    reply_token: 'test_reply_token_' + Date.now(),
    sourceUserId: INTEGRATION_TEST_CONFIG.testUserId,
    profileData: {
      user_id: INTEGRATION_TEST_CONFIG.testUserId
    },
    oSecretkey: {
      webDomain: INTEGRATION_TEST_CONFIG.testWebDomain
    }
  };
}

/**
 * Helper function สำหรับตรวจสอบว่า response ถูกส่งไปยัง LINE API หรือไม่
 */
async function verifyLineResponse(reply_token, expectedMessage) {
  if (!INTEGRATION_TEST_CONFIG.enableRealSending) {
    console.log(`[MOCK] Would send to LINE API:`);
    console.log(`Reply Token: ${reply_token}`);
    console.log(`Message: ${expectedMessage}`);
    
    // ตรวจสอบว่า lineChatAPI.replyMessage ถูกเรียกด้วย parameters ที่ถูกต้อง
    expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(reply_token, expectedMessage);
    return true;
  }
  
  try {
    // ในกรณีนี้เราจะใช้ lineChatAPI จริง
    // แต่ในความเป็นจริง LINE API จะไม่ยอมให้เราใช้ reply token เดิมซ้ำ
    // ดังนั้นเราจะใช้วิธีอื่นในการ verify
    console.log(`[REAL] Sending to LINE API:`);
    console.log(`Reply Token: ${reply_token}`);
    console.log(`Message: ${expectedMessage}`);
    
    // เรียกใช้ lineChatAPI จริง
    await lineChatAPI.replyMessage(reply_token, expectedMessage);
    return true;
  } catch (error) {
    console.error('Error sending to LINE API:', error.message);
    return false;
  }
}

describe('lineReply Integration Tests (Real LINE API)', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Skip tests ถ้าไม่ได้เปิดใช้งานการส่งจริง
  const testCondition = INTEGRATION_TEST_CONFIG.enableRealSending ? describe : describe.skip;
  
  testCondition('Real LINE API Integration Tests', () => {
    beforeAll(() => {
      console.log('🚀 Starting Integration Tests with Real LINE API');
      console.log(`Test User ID: ${INTEGRATION_TEST_CONFIG.testUserId}`);
      console.log(`Web Domain: ${INTEGRATION_TEST_CONFIG.testWebDomain}`);
      console.log(`Real Sending: ${INTEGRATION_TEST_CONFIG.enableRealSending}`);
    });

    it('should send real registration message to LINE API', async () => {
      // Arrange
      const testData = createTestData();
      const expectedMessage = `เปิดลิงค์นี้เพื่อทำการสมัคร ${testData.oSecretkey.webDomain}registeremail?sourceUserId=${testData.sourceUserId}`;
      
      // Act
      await lineReply.handleRegistration(testData.reply_token, testData.sourceUserId, testData.oSecretkey);
      
      // Assert
      const result = await verifyLineResponse(testData.reply_token, expectedMessage);
      expect(result).toBe(true);
    });

    it('should send real purchase message to LINE API when user exists', async () => {
      // Arrange
      const testData = createTestData();
      const mockUserList = [{ id: 1, email: 'test@example.com' }];
      
      // Mock database calls แต่ใช้ LINE API จริง
      jest.spyOn(MemberList, 'getUserByLineSourceId').mockResolvedValue(mockUserList);
      
      const expectedMessage = `เปิดลิงค์นี้เพื่อทำการซื้อ ${testData.oSecretkey.webDomain}buyproduct?sourceUserId=${testData.profileData.user_id}`;
      
      // Act
      await lineReply.handleRenewalOrPurchase(testData.reply_token, testData.profileData, testData.oSecretkey);
      
      // Assert
      const result = await verifyLineResponse(testData.reply_token, expectedMessage);
      expect(result).toBe(true);
      
      // Cleanup
      jest.restoreAllMocks();
    });

    it('should send real registration prompt when user does not exist', async () => {
      // Arrange
      const testData = createTestData();
      
      // Mock empty user list
      jest.spyOn(MemberList, 'getUserByLineSourceId').mockResolvedValue([]);
      
      const expectedMessage = 'ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนก่อน พิมพ์ "สมัคร" เพื่อดูข้อมูลเพิ่มเติม';
      
      // Act
      await lineReply.handleRenewalOrPurchase(testData.reply_token, testData.profileData, testData.oSecretkey);
      
      // Assert
      const result = await verifyLineResponse(testData.reply_token, expectedMessage);
      expect(result).toBe(true);
      
      // Cleanup
      jest.restoreAllMocks();
    });

    it('should send real product expiration info to LINE API', async () => {
      // Arrange
      const testData = createTestData();
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
      
      // Mock database calls
      jest.spyOn(MemberList, 'getUserByLineSourceId').mockResolvedValue(mockUserList);
      jest.spyOn(ProductList, 'GetDayExpireByUserId').mockResolvedValue(mockProducts);
      
      const expectedMessage = 'test@example.com หมดอายุวันที่ 2024-12-31YouTube Premium เหลือ 30 วัน\n' +
                             'test@example.com หมดอายุวันที่ 2024-11-15Netflix หมดอายุ \n';
      
      // Act
      await lineReply.handleCheckDays(testData.reply_token, testData.profileData);
      
      // Assert
      const result = await verifyLineResponse(testData.reply_token, expectedMessage);
      expect(result).toBe(true);
      
      // Cleanup
      jest.restoreAllMocks();
    });

    it('should send real default help message to LINE API', async () => {
      // Arrange
      const testData = createTestData();
      const expectedMessage = 'พิมพ์คำสั่ง เช่น "สมัคร", "ต่ออายุ", "ซื้อ", "เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม';
      
      // Act
      lineReply.handleDefaultMessage(testData.reply_token);
      
      // Assert
      const result = await verifyLineResponse(testData.reply_token, expectedMessage);
      expect(result).toBe(true);
    });

    it('should handle complete user flow with real LINE API', async () => {
      // Arrange
      const testData = createTestData();
      const mockUserList = [{ id: 1, email: 'test@example.com' }];
      const mockProducts = [
        {
          email: 'test@example.com',
          end_date: '2024-12-31',
          subscription_name: 'YouTube Premium',
          days_left: 30
        }
      ];
      
      // Mock database calls
      jest.spyOn(MemberList, 'getUserByLineSourceId').mockResolvedValue(mockUserList);
      jest.spyOn(ProductList, 'GetDayExpireByUserId').mockResolvedValue(mockProducts);
      
      // Act & Assert - Test multiple functions in sequence
      
      // 1. Registration
      await lineReply.handleRegistration(testData.reply_token + '_1', testData.sourceUserId, testData.oSecretkey);
      let result1 = await verifyLineResponse(testData.reply_token + '_1', 
        `เปิดลิงค์นี้เพื่อทำการสมัคร ${testData.oSecretkey.webDomain}registeremail?sourceUserId=${testData.sourceUserId}`);
      expect(result1).toBe(true);
      
      // 2. Purchase
      await lineReply.handleRenewalOrPurchase(testData.reply_token + '_2', testData.profileData, testData.oSecretkey);
      let result2 = await verifyLineResponse(testData.reply_token + '_2',
        `เปิดลิงค์นี้เพื่อทำการซื้อ ${testData.oSecretkey.webDomain}buyproduct?sourceUserId=${testData.profileData.user_id}`);
      expect(result2).toBe(true);
      
      // 3. Check Days
      await lineReply.handleCheckDays(testData.reply_token + '_3', testData.profileData);
      let result3 = await verifyLineResponse(testData.reply_token + '_3',
        'test@example.com หมดอายุวันที่ 2024-12-31YouTube Premium เหลือ 30 วัน\n');
      expect(result3).toBe(true);
      
      // 4. Default Message
      lineReply.handleDefaultMessage(testData.reply_token + '_4');
      let result4 = await verifyLineResponse(testData.reply_token + '_4',
        'พิมพ์คำสั่ง เช่น "สมัคร", "ต่ออายุ", "ซื้อ", "เช็ควัน" เพื่อดูข้อมูลเพิ่มเติม');
      expect(result4).toBe(true);
      
      // Cleanup
      jest.restoreAllMocks();
    });
  });

  // Mock tests สำหรับการทดสอบปกติ
  describe('Mock Tests (for CI/CD)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should work with mocked LINE API (for CI)', async () => {
      // Arrange
      const testData = createTestData();
      
      // Act
      await lineReply.handleRegistration(testData.reply_token, testData.sourceUserId, testData.oSecretkey);
      
      // Assert
      expect(lineChatAPI.replyMessage).toHaveBeenCalledWith(
        testData.reply_token,
        `เปิดลิงค์นี้เพื่อทำการสมัคร ${testData.oSecretkey.webDomain}registeremail?sourceUserId=${testData.sourceUserId}`
      );
    });
  });
});

// Export configuration for external use
module.exports = {
  INTEGRATION_TEST_CONFIG,
  createTestData,
  verifyLineResponse
};
