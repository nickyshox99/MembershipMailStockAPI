# LINE Reply Integration Tests

ไฟล์นี้ประกอบด้วย integration tests สำหรับ `lineReply.js` ที่สามารถส่งข้อความจริงไปยัง LINE API ได้

## การตั้งค่า

### 1. คัดลอกไฟล์ environment
```bash
cp env.test.example .env.test
```

### 2. แก้ไขค่าใน `.env.test`
```env
# LINE API Configuration
LINE_CHANNEL_ACCESS_TOKEN_TEST=your_test_channel_access_token
LINE_TEST_USER_ID=your_test_user_line_id
TEST_WEB_DOMAIN=https://your-test-domain.com/

# เปิด/ปิดการส่งข้อความจริง
ENABLE_REAL_LINE_SENDING=false
```

### 3. ดาวน์โหลด dependencies (ถ้ายังไม่มี)
```bash
npm install dotenv
```

## การใช้งาน

### รัน Unit Tests (Mock)
```bash
npm run test:unit
```

### รัน Integration Tests (Mock Mode)
```bash
npm run test:integration
```

### รัน Integration Tests (ส่งข้อความจริง)
```bash
npm run test:integration:real
```

### รัน Tests ทั้งหมด
```bash
npm run test:all
```

## วิธีการทำงาน

### Mock Mode (Default)
- ไม่ส่งข้อความจริงไปยัง LINE API
- แสดงข้อความที่ต้องการส่งใน console
- เหมาะสำหรับ CI/CD และการทดสอบปกติ

### Real Mode
- ส่งข้อความจริงไปยัง LINE API
- ใช้ LINE Channel Access Token จริง
- ต้องระวังเรื่อง rate limiting และ quota

## Test Cases

### 1. handleRegistration
- ทดสอบการส่งลิงค์สมัครสมาชิก
- ทดสอบการจัดการ webDomain ว่าง

### 2. handleRenewalOrPurchase
- ทดสอบการส่งลิงค์ซื้อเมื่อผู้ใช้มีอยู่
- ทดสอบการส่งข้อความให้สมัครเมื่อผู้ใช้ไม่มี
- ทดสอบการจัดการ database error

### 3. handleCheckDays
- ทดสอบการแสดงข้อมูลวันหมดอายุ
- ทดสอบการแสดง "ไม่มีข้อมูล"
- ทดสอบการส่งข้อความให้สมัครเมื่อผู้ใช้ไม่มี

### 4. handleDefaultMessage
- ทดสอบการส่งข้อความช่วยเหลือ

### 5. Integration Flow
- ทดสอบการทำงานร่วมกันของหลาย functions
- ทดสอบ complete user journey

## ข้อควรระวัง

1. **Rate Limiting**: LINE API มี rate limit อย่าใช้ reply token เดิมซ้ำ
2. **Quota**: ตรวจสอบ quota ของ LINE Channel
3. **Test User**: ใช้ test user ID ที่ถูกต้อง
4. **Environment**: แยก environment สำหรับ test และ production

## การ Debug

### เปิด Debug Mode
```bash
DEBUG=lineReply* npm run test:integration:real
```

### ดู Logs
```bash
# ดู logs ของ LINE API
tail -f logs/line-api.log

# ดู logs ของ application
tail -f logs/app.log
```

## Troubleshooting

### Error: Invalid reply token
- Reply token สามารถใช้ได้ครั้งเดียวเท่านั้น
- สร้าง reply token ใหม่สำหรับแต่ละ test

### Error: Invalid user ID
- ตรวจสอบ LINE_TEST_USER_ID ใน .env.test
- ใช้ user ID ที่มีอยู่จริงใน LINE Channel

### Error: Rate limit exceeded
- รอสักครู่ก่อนรัน test อีกครั้ง
- ลดจำนวน test cases หรือใช้ mock mode
