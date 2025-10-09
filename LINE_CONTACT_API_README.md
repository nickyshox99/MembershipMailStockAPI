# Line Contact API Documentation

API สำหรับดึงข้อมูล line_contact และค้นหาข้อมูล พร้อม Bearer Token Authentication

## Base URL
```
http://localhost:10600
```
หรือ URL ที่ server ของคุณใช้งาน

## Authentication
ทุก API ต้องส่ง **Bearer Token** ผ่าน `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get All Line Contacts (with Search & Pagination)

**Endpoint:** `POST /api/linecontact/getlinecontact/`

**Description:** ดึงข้อมูล line_contact ทั้งหมด พร้อมฟีเจอร์ค้นหาและแบ่งหน้า

**Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token_here",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "searchword": "ค้นหา",
  "page": 1,
  "perPage": 20
}
```

**Request Body Parameters:**
- `searchword` (optional): คำค้นหา - จะค้นหาใน display_name, user_id, alias_userid, note, tag
- `page` (optional, default: 1): หน้าที่ต้องการดึงข้อมูล
- `perPage` (optional, default: 20): จำนวนข้อมูลต่อหน้า

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Get line contact successfully",
  "data": [
    {
      "id": 1,
      "bot_user_id": "Uxxxxx",
      "user_id": "Uxxxxx",
      "display_name": "John Doe",
      "language": "th",
      "picture_url": "https://...",
      "status_message": "Hello",
      "alias_userid": "john123",
      "note": "VIP customer",
      "note_by": "admin",
      "note_at": "2025-10-08 10:00:00",
      "tag": "vip,premium",
      "last_update": "2025-10-08 10:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "status": "error",
  "message": "No Bearer token provided",
  "data": []
}
```

**Response Error (500):**
```json
{
  "status": "error",
  "message": "Error message",
  "data": []
}
```

---

### 2. Get Line Contact by ID

**Endpoint:** `GET /api/linecontact/getlinecontactbyid/:Id`

**Description:** ดึงข้อมูล line_contact ตาม ID

**Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token_here"
}
```

**URL Parameters:**
- `Id`: ID ของ line_contact

**Example Request:**
```
GET http://localhost:10600/api/linecontact/getlinecontactbyid/1
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Get line contact by id successfully",
  "data": {
    "id": 1,
    "bot_user_id": "Uxxxxx",
    "user_id": "Uxxxxx",
    "display_name": "John Doe",
    "language": "th",
    "picture_url": "https://...",
    "status_message": "Hello",
    "alias_userid": "john123",
    "note": "VIP customer",
    "note_by": "admin",
    "note_at": "2025-10-08 10:00:00",
    "tag": "vip,premium",
    "last_update": "2025-10-08 10:00:00"
  }
}
```

**Response Not Found (404):**
```json
{
  "status": "error",
  "message": "Line contact not found",
  "data": null
}
```

**Response Unauthorized (401):**
```json
{
  "status": "error",
  "message": "Invalid or expired token",
  "data": null
}
```

---

### 3. Get Line Contact by User ID

**Endpoint:** `GET /api/linecontact/getlinecontactbyuserid/:userId`

**Description:** ดึงข้อมูล line_contact ตาม LINE User ID

**Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token_here"
}
```

**URL Parameters:**
- `userId`: LINE User ID

**Example Request:**
```
GET http://localhost:10600/api/linecontact/getlinecontactbyuserid/Uxxxxxxxxxxxxx
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Get line contact by user id successfully",
  "data": [
    {
      "id": 1,
      "bot_user_id": "Uxxxxx",
      "user_id": "Uxxxxx",
      "display_name": "John Doe",
      "language": "th",
      "picture_url": "https://...",
      "status_message": "Hello",
      "alias_userid": "john123",
      "note": "VIP customer",
      "note_by": "admin",
      "note_at": "2025-10-08 10:00:00",
      "tag": "vip,premium",
      "last_update": "2025-10-08 10:00:00"
    }
  ]
}
```

---

## Postman Testing Examples

### ตัวอย่างการทดสอบ Endpoint 1: Get All Line Contacts

1. **เปิด Postman** และสร้าง Request ใหม่
2. **เลือก Method:** POST
3. **URL:** `http://localhost:10600/api/linecontact/getlinecontact/`
4. **Headers:**
   - Key: `Authorization`, Value: `Bearer your_jwt_token_here`
   - Key: `Content-Type`, Value: `application/json`
5. **Body:** เลือก `raw` และ `JSON` แล้วใส่:
```json
{
  "searchword": "",
  "page": 1,
  "perPage": 20
}
```
6. **กดปุ่ม Send**

### ตัวอย่างการค้นหาข้อมูล

ใน Body ให้ใส่:
```json
{
  "searchword": "John",
  "page": 1,
  "perPage": 10
}
```

### ตัวอย่างการทดสอบ Endpoint 2: Get by ID

1. **เลือก Method:** GET
2. **URL:** `http://localhost:10600/api/linecontact/getlinecontactbyid/1`
3. **Headers:**
   - Key: `Authorization`, Value: `Bearer your_jwt_token_here`
4. **กดปุ่ม Send**

### ตัวอย่างการทดสอบ Endpoint 3: Get by User ID

1. **เลือก Method:** GET
2. **URL:** `http://localhost:10600/api/linecontact/getlinecontactbyuserid/Uxxxxxxxxxxxxx`
3. **Headers:**
   - Key: `Authorization`, Value: `Bearer your_jwt_token_here`
4. **กดปุ่ม Send**

---

## วิธีใช้ Bearer Token ใน Postman (แบบง่าย)

### วิธีที่ 1: ใช้ Authorization Tab (แนะนำ)
1. ไปที่แท็บ **Authorization**
2. เลือก Type: **Bearer Token**
3. ใส่ Token ของคุณในช่อง **Token**
4. Postman จะเพิ่ม Header `Authorization: Bearer <token>` ให้อัตโนมัติ

### วิธีที่ 2: เพิ่ม Header เองโดยตรง
1. ไปที่แท็บ **Headers**
2. เพิ่ม Key: `Authorization`
3. ใส่ Value: `Bearer your_jwt_token_here` (มีคำว่า Bearer นำหน้า)

---

## Error Codes

- **200**: Success
- **401**: Unauthorized (ไม่มี token หรือ token ไม่ถูกต้อง)
- **404**: Not Found (ไม่พบข้อมูล)
- **500**: Internal Server Error

---

## Search Feature

ฟีเจอร์ค้นหาจะค้นหาใน fields ต่อไปนี้:
- `display_name`: ชื่อแสดงของผู้ใช้
- `user_id`: LINE User ID
- `alias_userid`: ชื่อเล่นที่กำหนดเอง
- `note`: หมายเหตุ
- `tag`: แท็ก

ตัวอย่าง: ถ้าค้นหา "John" จะค้นหาทุก field ที่มีคำว่า "John" อยู่

---

## Notes

1. **Bearer Token** เป็นมาตรฐาน REST API authentication
2. Token ต้องมีคำว่า "Bearer " นำหน้า (มีช่องว่าง)
3. Default perPage = 20 items
4. Default page = 1
5. ข้อมูลจะเรียงตาม ID จากมากไปน้อย (DESC)
6. Token จะถูกเช็คความถูกต้องทุกครั้งที่เรียก API

---

## cURL Examples

### Get All Contacts
```bash
curl -X POST http://localhost:10600/api/linecontact/getlinecontact/ \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{"searchword":"","page":1,"perPage":20}'
```

### Get by ID
```bash
curl -X GET http://localhost:10600/api/linecontact/getlinecontactbyid/1 \
  -H "Authorization: Bearer your_jwt_token_here"
```

### Get by User ID
```bash
curl -X GET http://localhost:10600/api/linecontact/getlinecontactbyuserid/Uxxxxx \
  -H "Authorization: Bearer your_jwt_token_here"
```
