# Account Summary Report API

## Overview
API endpoint สำหรับดึงข้อมูลสรุปรายงานสถานะของ Account สมาชิกภาพ

## Endpoint
```
POST /api/report/getAccountSummaryReport
```

## Headers
```
Content-Type: application/json
userid: [admin_username]
token: [admin_token]
```

## Request Body
```json
{
  "userid": "admin_username",
  "page_name": "report_summary"
}
```

## Response Format
```json
{
  "status": "success",
  "message": "",
  "auth": true,
  "data": {
    "activeAccounts": 320,
    "expiredAccounts": 100,
    "expiringIn3Days": 50,
    "expiringIn7Days": 70,
    "expiringIn30Days": 30,
    "moreThan30Days": 20
  }
}
```

## Data Fields Description

| Field | Description |
|-------|-------------|
| `activeAccounts` | จำนวน Account ที่ Active อยู่ (ยังไม่หมดอายุ) |
| `expiredAccounts` | จำนวน Account ที่หมดอายุแล้ว |
| `expiringIn3Days` | จำนวน Account ที่กำลังจะหมดอายุใน 3 วัน |
| `expiringIn7Days` | จำนวน Account ที่กำลังจะหมดอายุใน 7 วัน |
| `expiringIn30Days` | จำนวน Account ที่กำลังจะหมดอายุใน 30 วัน |
| `moreThan30Days` | จำนวน Account ที่มีอายุการใช้งานเหลือมากกว่า 30 วัน |

## Database Logic

API นี้ใช้ข้อมูลจากตาราง `membership_order_history` โดย:

1. **Active Accounts**: `DATEDIFF(end_date, CURDATE()) > 0`
2. **Expired Accounts**: `DATEDIFF(end_date, CURDATE()) <= 0`
3. **Expiring in 3 days**: `DATEDIFF(end_date, CURDATE()) BETWEEN 1 AND 3`
4. **Expiring in 7 days**: `DATEDIFF(end_date, CURDATE()) BETWEEN 4 AND 7`
5. **Expiring in 30 days**: `DATEDIFF(end_date, CURDATE()) BETWEEN 8 AND 30`
6. **More than 30 days**: `DATEDIFF(end_date, CURDATE()) > 30`

เงื่อนไขเพิ่มเติม:
- `slip_correct = 1` (การชำระเงินถูกต้อง)
- `canceled <> 1` (ไม่ถูกยกเลิก)
- นับเฉพาะ email ที่ไม่ซ้ำกัน (`COUNT(DISTINCT email)`)

## Frontend Integration

### Vuex Action
```javascript
async GetAccountSummaryReport({commit}, inputData) {
  // Implementation in systemdata.js
}
```

### Vue Component Usage
```javascript
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["GetAccountSummaryReport"]),
    async search() {
      const formData = new FormData();
      formData.append("userid", userData.username);
      formData.append("token", userData.token);
      formData.append("page_name", "report_summary");
      
      const response = await this.GetAccountSummaryReport(formData);
      // Handle response...
    }
  }
}
```

## Error Handling

### Authentication Error
```json
{
  "status": "error",
  "message": "Authenication Failed",
  "auth": false,
  "data": []
}
```

### IP Blocked Error
```
HTTP 202: Unauthorize ip. (IP_ADDRESS)
```

### Missing Headers Error
```json
{
  "status": "error",
  "message": "Please provide all required headers"
}
```

## Files Modified

### Backend
- `src/models/productlist.model.js` - Added `getAccountSummaryReport()` function
- `src/controllers/report.controller.js` - Added `getAccountSummaryReport()` controller
- `src/routes/report.route.js` - Added route endpoint

### Frontend
- `src/store/modules/systemdata.js` - Added `GetAccountSummaryReport()` action
- `src/views/apps/report/ReportLoanAll.vue` - Updated to use real API data
- `src/libs/i18n/locales/th.json` - Added Thai translations

## Testing

### Manual Testing
1. Start the API server
2. Login as admin user
3. Call the API endpoint with proper headers
4. Verify the response data matches database records

### Frontend Testing
1. Navigate to the report page
2. Check if data loads correctly
3. Verify error handling works
4. Test with different date ranges (if applicable)

## Performance Considerations

- The query uses `UNION ALL` which can be optimized for large datasets
- Consider adding database indexes on `end_date` and `email` columns
- Monitor query execution time for large datasets
- Consider caching results if data doesn't change frequently

## Future Enhancements

1. Add date range filtering
2. Add subscription type filtering
3. Add pagination for detailed reports
4. Add export functionality
5. Add real-time updates via WebSocket
