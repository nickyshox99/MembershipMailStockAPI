# Docker Infrastructure Management Scripts

Scripts สำหรับจัดการ Docker infrastructure ของ Membership API

## 📁 Scripts ที่มี

### 🚀 Main Script
- **`docker-manager.sh`** - Script หลักสำหรับจัดการทุกอย่าง

### 🔧 Individual Scripts
- **`install.sh`** - ติดตั้ง Docker infrastructure
- **`start.sh`** - เริ่ม services ทั้งหมด
- **`stop.sh`** - หยุด services ทั้งหมด
- **`restart.sh`** - รีสตาร์ท services ทั้งหมด
- **`status.sh`** - แสดงสถานะของ services
- **`logs.sh`** - แสดง logs ของ services

## 🎯 การใช้งาน

### วิธีที่ 1: ใช้ Main Script
```bash
# ติดตั้ง infrastructure
./docker-manager.sh install

# เริ่ม services
./docker-manager.sh start

# หยุด services
./docker-manager.sh stop

# รีสตาร์ท services
./docker-manager.sh restart

# ดูสถานะ
./docker-manager.sh status

# ดู logs
./docker-manager.sh logs

# ลบทุกอย่าง
./docker-manager.sh clean
```

### วิธีที่ 2: ใช้ Individual Scripts
```bash
# ติดตั้ง
./install.sh

# เริ่ม
./start.sh

# หยุด
./stop.sh

# รีสตาร์ท
./restart.sh

# ดูสถานะ
./status.sh

# ดู logs
./logs.sh
```

## 🌐 Services URLs

หลังจากเริ่ม services แล้ว สามารถเข้าถึงได้ที่:

- **API:** http://localhost:10600
- **phpMyAdmin:** http://localhost:8080
- **MySQL:** localhost:3306

## 🔐 การเข้าสู่ระบบ

### phpMyAdmin
- **Server:** mysql (หรือ localhost)
- **Username:** root
- **Password:** (ว่างเปล่า)

### MySQL
- **Host:** localhost
- **Port:** 3306
- **Username:** root
- **Password:** (ว่างเปล่า)
- **Database:** membership

## 📋 ขั้นตอนการใช้งาน

1. **ติดตั้ง:** `./install.sh`
2. **เริ่ม:** `./start.sh`
3. **ตรวจสอบ:** `./status.sh`
4. **ใช้งาน:** เข้าถึง services ผ่าน URLs ข้างต้น
5. **หยุด:** `./stop.sh` (เมื่อไม่ใช้งาน)

## 🛠️ Troubleshooting

### ดู Logs
```bash
# ดู logs ทั้งหมด
./logs.sh

# ดู logs ของ service เฉพาะ
./logs.sh mysql
./logs.sh phpmyadmin
./logs.sh api
```

### รีสตาร์ท Services
```bash
./restart.sh
```

### ลบทุกอย่างและเริ่มใหม่
```bash
./docker-manager.sh clean
./install.sh
./start.sh
```

## 📝 หมายเหตุ

- Scripts จะตรวจสอบ Docker และ Docker Compose ก่อนรัน
- ข้อมูลจะถูกเก็บใน Docker volume `mysql_data`
- สามารถใช้ `docker ps` เพื่อดูสถานะ containers ได้
