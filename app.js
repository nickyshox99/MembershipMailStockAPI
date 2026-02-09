const express = require('express');
const axios = require('axios');

const bodyParser = require('body-parser');
var async = require('async')

let cors = require('cors')
var path = require('path');

const SecretKey = require('./config/secret');

const cron = require('node-cron');

const dbConn = require('./config/db.config');
const { json } = require('body-parser');
const excelJS = require("exceljs");


const rateLimit = require('express-rate-limit');

//Blocked ip address
const blockedIps = [];

const adminListRoutes  =require('./src/routes/adminlist.route');
const uploadFileRoutes  =require('./src/routes/uploadfile.route');
const adminSettingRoutes = require('./src/routes/adminsetting.route');
const promotionRoutes = require('./src/routes/promotionlist.route');
const popupSetttingRoutes = require('./src/routes/popupsetting.route');
const lineLoginRoutes  =require('./src/routes/linelogin.route');
const memberRoutes = require('./src/routes/memberlist.route');
const bannerRoutes = require('./src/routes/bannersetting.route');
const announcementSettingRoutes = require('./src/routes/announcementsetting.route');
const generalRoutes = require('./src/routes/general.route');
const adminBankRoutes = require('./src/routes/adminbanklist.route');
const referListRoutes = require('./src/routes/referlist.route');
const otpManageRoutes = require('./src/routes/otpmanage.route');
const productRoutes = require('./src/routes/product.route');
const transactionRoutes = require('./src/routes/transaction.route');
const staffGroupListRoutes = require('./src/routes/staffgrouplist.route');
const staffListRoutes = require('./src/routes/stafflist.route');
const interestTypeRoutes = require('./src/routes/interesttype.route');
const subscriptionTypeRoutes = require('./src/routes/subscriptiontype.route');
const loanListRoutes = require('./src/routes/loanlist.route');
const reportRoutes = require('./src/routes/report.route');
const subscriptionGruopRoutes = require('./src/routes/subscriptiongroup.route');
const reportZendRoutes = require('./src/routes/report.zend.route');
const personalEmailRoutes = require('./src/routes/personalemail.route');
const personalEmailNewRoutes = require('./src/routes/personal_email.route');
const usersEmailRoutes = require('./src/routes/usersemail.route');
const btnStatusRoutes = require('./src/routes/btnstatus.route');
const paymentTypeRoutes = require('./src/routes/paymenttype.route');

const lineChatSettingRoutes  =require('./src/routes/linechatsetting.route');
const lineChatRoutes  =require('./src/routes/linechat.route');
const lineContactRoutes = require('./src/routes/linecontact.route');

const lineRoutes = require('./src/routes/line.route');
const LineChatAPI = require('./src/modules/lineChatAPI');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const oSecretkey = require('./config/secret');

// Setup server port
const port = process.env.PORT || 10600;

// create express app
let app = express();

const favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.ico'));

// const MByte = 1048576;

// setInterval(() => {
//     const startUsage = process.cpuUsage();    
//     const endUsage = process.cpuUsage(startUsage);
    
//     console.log('User CPU time:', endUsage.user / 1000000, 'seconds');
//     console.log('System CPU time:', endUsage.system / 1000000, 'seconds');

//     const {rss,heapTotal,external,heapUsed} = process.memoryUsage();
//     console.log('rss',(rss/MByte).toFixed(2),
//             'external ',(external/MByte).toFixed(2),
//             'heapUsed ', (heapUsed/MByte).toFixed(2),
//             'heapTotal ', (heapTotal/MByte).toFixed(2)
//     );
// }, 5000);

// const originalConsoleLog = console.log.bind(console);
// const turnOffConsoleLog = true;

// if (turnOffConsoleLog) {
    
//     console.log = function(...args) {
//     // Join all arguments into a single string
//     const message = args.join(' ');
//         // Check if the message contains the word "rss"
//         if (message.includes('heapUsed')) {
//             // If yes, call the original console.log
//             originalConsoleLog.apply(console, args);
//         }else if (message.includes('CPU')) {
//             // If yes, call the original console.log
//             originalConsoleLog.apply(console, args);
//         }
        
//     };
// }

// app.set('trust proxy', 1);

// const limiter = rateLimit({
//     windowMs: 5 * 60 * 1000, // 5 minutes
//     max: 2000, // limit each IP to 2000 requests per windowMs
//   });
  
// app.use(limiter);

const Cryptof = require('./src/models/cryptof.model');

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
}));

app.use(express.static(path.join(__dirname, '/src')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

// parse requests of content-type - application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ limit: '50mb' , extended: true }))
    // parse requests of content-type - application/json
//app.use(bodyParser.json())

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}

function formatStrToDate(StrDate) {
    const tmpDate = StrDate.split('/');
    const newDateStr = tmpDate[2] + "/" + tmpDate[1] + "/" + tmpDate[0];
    const newDate = new Date(newDateStr);
    return newDate;
}

function formatStrToDate2(StrDate) {
    const tmpDate = StrDate.split('/');
    const newDateStr = tmpDate[2] + "-" + tmpDate[1] + "-" + tmpDate[0] + " :00:00:00";
    return newDateStr;
}

//====================================================================

var curDate = new Date();

const LineLog = require('./src/modules/linelog');
const lineLog = new LineLog();

const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");

//Run Line Log
// cron.schedule('0 * * * *', async () => {
//  //cron.schedule('* * * * *', async () => {
    
//     try {        
//         await lineLog.getLineLog();
//     }
//     catch (error) 
//     {
//         console.log(error);
//     }    
// });

// cron.schedule('*/10 * * * *', async () => {
//     console.log("Read Email ", new Date().toISOString())
//     try{
//         const lineChatAPI = new LineChatAPI();

//         let msg ="";

//         let emailHead = await MainModel.query(`SELECT * FROM subscription_group WHERE status=1 AND head_email<>'' AND password<>'' `);
//         for (let index = 0; index < emailHead.length; index++) {
//             const element = emailHead[index];

//             const config = {
//                 imap: {
//                     //user: "enemybehindbehind@gmail.com",
//                     //password: "fgby kpwo fuoc okob", //สร้างจาก https://myaccount.google.com/apppasswords
//                     user: element['head_email'],
//                     password: element['password'],    
//                     host: "imap.gmail.com",
//                     port: 993,
//                     tls: true,
//                     authTimeout: 3000,
//                     tlsOptions: { rejectUnauthorized: false },
//                 },
//             };

//             let connection;

//             imaps
//                 .connect(config)
//                 .then((conn) => {
//                     connection = conn;
//                     return connection.openBox("INBOX");
//                 })
//                 .then(async () => {
//                     const searchCriteria = ["UNSEEN", ["SINCE", "01-Jun-2025"]];
//                     const fetchOptions = {
//                     bodies: [""], // 👈 raw email
//                     markSeen: true,
//                     };

//                     const messages = await connection.search(searchCriteria, fetchOptions);
//                     console.log(`📬 Found ${messages.length} unread messages`);

//                     for (const message of messages) {
//                         const all = message.parts.find((part) => part.which === "");
//                         if (!all?.body) {
//                             console.log("⚠️ ไม่มีเนื้อหาในอีเมลนี้");
//                             continue;
//                         }

//                         const parsed = await simpleParser(all.body);
//                         const body = parsed.text || parsed.html || "";
//                         let tmpRemark="";

//                         if (body.includes("คำเชิญเข้าร่วมกลุ่มครอบครัวได้รับการตอบรับแล้ว")) 
//                         {
                        

//                         const match = body.match(/\(([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
//                         if (match) {
//                             const email = match[1];
//                             console.log("มีอีเมลล์ตอบรับเข้ากลุ่มใหม่ : ",email);
                            
//                             const tmpOrder = await MainModel.queryFirstRow(`SELECT * FROM membership_order_history WHERE 
//                                 email='${email}' AND canceled=0 
//                                 AND membership_order_history.canceled=0
//                                 AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'')
//                                 AND (membership_order_history.sent_email_by is NULL OR membership_order_history.sent_email_by ='')
//                                 ORDER BY subscription_type_id , email,end_date DESC 
//                             `);

//                             if (tmpOrder.length>0) 
//                             {
//                                 let row_user = await MemberList.findById(tmpOrder['user_id']);
//                                 if (row_user.length<=0) 
//                                 {
//                                     tmpRemark ="Not found user : "+tmpOrder['user_id'];
//                                     console.log(tmpRemark);
//                                     MainModel.insert("email_accept_member",{email:email,read_at:timerHelper.getDateTimeNowString(),send_line_complete:0,remark:tmpRemark});
//                                 }
//                                 else
//                                 {
//                                     let sourceUserId = row_user["line_userid"];
//                                     let contact = await lineChatSetting.getContactByUserId(sourceUserId);
//                                     let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

//                                     if (tmpChatSetting['status']!=1) 
//                                     {   
//                                         tmpRemark ="Line Bot Not Active for : "+tmpOrder['user_id'];
//                                         console.log(tmpRemark);
//                                         MainModel.insert("email_accept_member",{email:email,read_at:timerHelper.getDateTimeNowString(),send_line_complete:0,remark:tmpRemark});
//                                     }
//                                     else
//                                     {
//                                         let msg ="";
//                                         msg = "ขณะนี้แพ็คเก็จ "+tmpOrder['product_name']+" ของ "+ tmpOrder['email']+ " รอการชำระเงิน\n";
//                                         msg += "ท่านสามารถชำระเงินได้ตามลิงค์นี้ \n";
//                                         msg += oSecretkey.webDomain+ "confirmpayment?id="+tmpOrder['id']+"&email="+tmpOrder['email'];

//                                         let channelToken ="";
//                                         channelToken = tmpChatSetting['channel_token'];
//                                         lineChatAPI.setToken(channelToken);
//                                         const tmpSend = await lineChatAPI.pushMessage(sourceUserId ,msg);  
//                                         if (tmpSend['error']) 
//                                         {
//                                             tmpRemark ="Line Push Message : "+tmpSend['error'];
//                                             console.log(tmpRemark);
//                                             MainModel.insert("email_accept_member",{email:email,read_at:timerHelper.getDateTimeNowString(),send_line_complete:0,remark:tmpRemark});
//                                         }
//                                         else
//                                         {
//                                             tmpRemark=msg;
//                                             MainModel.insert("email_accept_member",{email:email,read_at:timerHelper.getDateTimeNowString(),send_line_complete:1,remark:tmpRemark});
//                                         }
//                                     }
//                                 }
//                             }   
//                         } else {
                            
//                         }
//                     }
//                 }
//                 })
//                 .catch((err) => {
//                     console.error("❌ Error:", err);
//                 })
//                 .finally(() => {
//                     if (connection) {
//                     connection.end();
//                     }
//                 });
//             }

//     }
//     catch (error) 
//     {
//         console.log(error);
//     }    
// });

// cron.schedule('0 * * * *', async () => {
    
//     try{

//         console.log("Check Daily Sent Line", new Date().toISOString())
//         const lineChatAPI = new LineChatAPI();

//         const dailysent = MainModel.query("SELECT * FROM daily_sent WHERE date(last_sent)='"+ timerHelper.getDateNowString() +"'");
//         if (dailysent.length==0) {
//             const justExpiredOrder = await productList.GetOrderJustExpired();
//             for (let index = 0; index < justExpiredOrder.length; index++) {
//                 const tmpOrder = justExpiredOrder[index];
//                 const tmpRemark = tmpOrder['user_id']+" "+tmpOrder['email']+" "+tmpOrder['product_name']+" เหลือ "+ tmpOrder['days_left'] +" วัน"
//                 console.log(tmpRemark);
//                 let row_user = await MemberList.findById(tmpOrder['user_id']);
//                 if (row_user.length<=0) 
//                 {
//                     tmpRemark ="Not found user : "+tmpOrder['user_id'];
//                     console.log(tmpRemark);
//                     MainModel.insert("line_sent_message",{
//                         email:tmpOrder['email']
//                         ,user_id:tmpOrder['user_id']
//                         ,product_name:tmpOrder['product_name']
//                         ,send_at:timerHelper.getDateTimeNowString()                        
//                         ,send_line_complete:0
//                         ,remark:tmpRemark});
//                 }
//                 else
//                 {
//                     let sourceUserId = row_user["line_userid"];
//                     let contact = await lineChatSetting.getContactByUserId(sourceUserId);
//                     let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

//                     if (tmpChatSetting['status']!=1) 
//                     {   
//                         tmpRemark ="Line Bot Not Active for : "+tmpOrder['user_id'];
//                         console.log(tmpRemark);
//                         MainModel.insert("line_sent_message",{
//                             email:tmpOrder['email']
//                             ,user_id:tmpOrder['user_id']
//                             ,product_name:tmpOrder['product_name']
//                             ,send_at:timerHelper.getDateTimeNowString()                        
//                             ,send_line_complete:0
//                             ,remark:tmpRemark});
//                     }
//                     else
//                     {
//                         let msg ="";
//                         msg = "ขณะนี้แพ็คเก็จ "+row_order['product_name']+" ของ "+ row_order['email']+ " ได้หมดอายุแล้ว\n";
//                         msg += "ท่านสามารถต่ออายุได้ตามลิงค์นี้ \n";
//                         msg += oSecretkey.webDomain+ "buyproduct?sourceUserId="+sourceUserId+"&email="+row_order['email'];

//                         let channelToken ="";
//                         channelToken = tmpChatSetting['channel_token'];
//                         lineChatAPI.setToken(channelToken);
//                         const tmpSend = await lineChatAPI.pushMessage(sourceUserId ,msg);  
//                         if (tmpSend['error']) 
//                         {
//                             tmpRemark ="Line Push Message : "+tmpSend['error'];
//                             console.log(tmpRemark);
//                             MainModel.insert("line_sent_message",{
//                                 email:tmpOrder['email']
//                                 ,user_id:tmpOrder['user_id']
//                                 ,product_name:tmpOrder['product_name']
//                                 ,send_at:timerHelper.getDateTimeNowString()                        
//                                 ,send_line_complete:0
//                                 ,remark:tmpRemark});
//                         }
//                         else
//                         {
//                             tmpRemark=msg;
//                             MainModel.insert("line_sent_message",{
//                             email:tmpOrder['email']
//                             ,user_id:tmpOrder['user_id']
//                             ,product_name:tmpOrder['product_name']
//                             ,send_at:timerHelper.getDateTimeNowString()                        
//                             ,send_line_complete:1
//                             ,remark:tmpRemark});
//                         }
//                     }
//                 }
//             }            
//             MainModel.insert("daily_sent",{last_sent:timerHelper.getDateNowString()});
//         }
        
//     }
//     catch (error) 
//     {
//         console.log(error);
//     }  
// });


// cron.schedule('0 * * * *', async () => {
    
//     try{

//         console.log("Check Daily Sent Line", new Date().toISOString())
//         const lineChatAPI = new LineChatAPI();

//         const dailysent = MainModel.query("SELECT * FROM daily_sent WHERE date(last_sent)='"+ timerHelper.getDateNowString() +"'");
//         if (dailysent.length==0) {
//             // const justExpiredOrder = await productList.GetOrderJustExpired();
//             const expiredOrders = await productList.GetOrderExpired();
//             for (let index = 0; index < expiredOrders.length; index++) {
//                 const tmpOrder = expiredOrders[index];
//                 const tmpRemark = tmpOrder['user_id']+" "+tmpOrder['email']+" "+tmpOrder['product_name']+" เหลือ "+ tmpOrder['days_left'] +" วัน"
//                 console.log(tmpRemark);
//                 let row_user = await MemberList.findById(tmpOrder['user_id']);
//                 if (row_user.length<=0) 
//                 {
//                     tmpRemark ="Not found user : "+tmpOrder['user_id'];
//                     console.log(tmpRemark);
//                     MainModel.insert("line_sent_message",{
//                         email:tmpOrder['email']
//                         ,user_id:tmpOrder['user_id']
//                         ,product_name:tmpOrder['product_name']
//                         ,send_at:timerHelper.getDateTimeNowString()                        
//                         ,send_line_complete:0
//                         ,remark:tmpRemark});
//                 }
//                 else
//                 {
//                     let sourceUserId = row_user["line_userid"];
//                     let contact = await lineChatSetting.getContactByUserId(sourceUserId);
//                     let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

//                     if (tmpChatSetting['status']!=1) 
//                     {   
//                         tmpRemark ="Line Bot Not Active for : "+tmpOrder['user_id'];
//                         console.log(tmpRemark);
//                         MainModel.insert("line_sent_message",{
//                             email:tmpOrder['email']
//                             ,user_id:tmpOrder['user_id']
//                             ,product_name:tmpOrder['product_name']
//                             ,send_at:timerHelper.getDateTimeNowString()                        
//                             ,send_line_complete:0
//                             ,remark:tmpRemark});
//                     }
//                     else
//                     {
//                         let msg ="";
//                         msg = "ขณะนี้แพ็คเก็จ "+tmpOrder['product_name']+" ของ "+ tmpOrder['email']+ " ได้หมดอายุแล้ว\n";
//                         msg += "ท่านสามารถต่ออายุได้ตามลิงค์นี้ \n";
//                         msg += oSecretkey.webDomain+ "buyproduct?sourceUserId="+sourceUserId+"&email="+tmpOrder['email'];

//                         let channelToken ="";
//                         channelToken = tmpChatSetting['channel_token'];
//                         lineChatAPI.setToken(channelToken);
//                         const tmpSend = await lineChatAPI.pushMessage(sourceUserId ,msg);  
//                         if (tmpSend['error']) 
//                         {
//                             tmpRemark ="Line Push Message : "+tmpSend['error'];
//                             console.log(tmpRemark);
//                             MainModel.insert("line_sent_message",{
//                                 email:tmpOrder['email']
//                                 ,user_id:tmpOrder['user_id']
//                                 ,product_name:tmpOrder['product_name']
//                                 ,send_at:timerHelper.getDateTimeNowString()                        
//                                 ,send_line_complete:0
//                                 ,remark:tmpRemark});
//                         }
//                         else
//                         {
//                             tmpRemark=msg;
//                             MainModel.insert("line_sent_message",{
//                             email:tmpOrder['email']
//                             ,user_id:tmpOrder['user_id']
//                             ,product_name:tmpOrder['product_name']
//                             ,send_at:timerHelper.getDateTimeNowString()                        
//                             ,send_line_complete:1
//                             ,remark:tmpRemark});
//                         }
//                     }
//                 }
//             }            
//             MainModel.insert("daily_sent",{last_sent:timerHelper.getDateNowString()});
//         }
        
//     }
//     catch (error) 
//     {
//         console.log(error);
//     }  
// });

cron.schedule('0 * * * *', async () => {
    try {
       await checkAndSendLineNotify()
        
    } catch (error) {
        console.log(error);
    }
});

app.get('/api/sendLine', function(req, res, next) {
    
    checkAndSendLineNotify()
  
    res.status(200).json({
        status: "success",
      });
      return;
    }
)


async function checkAndSendLineNotify(){
    try {
        console.log("Check Daily Sent Line", new Date().toISOString())

        //ถ้าเวลายังไม่เกิน 17.00 ให้ return ออกตรงนี้เลย
        const now = new Date();
        const currentHour = now.getHours();
        if (currentHour < 10) {            
            return;
        }

        const lineChatAPI = new LineChatAPI();

        const dailysent = await MainModel.query("SELECT * FROM daily_sent WHERE date(last_sent)='" + timerHelper.getDateNowString() + "'");
        
        if (dailysent.length == 0) {
           
            const meta_setting = await adminSettingList.findById("line_token");
            const lineSetting = JSON.parse(meta_setting.value);

            const autoExpire  = lineSetting.enableAutoExpireMessage === 1
                || lineSetting.enableAutoExpireMessage === true
                || lineSetting.enableAutoExpireMessage === '1';
            const repeatDays  = Number(lineSetting.expireMessageRepeat) || 0;

            if (autoExpire && repeatDays > 0) {
                const expiredOrders = await productList.GetOrderExpired();
                for (const o of expiredOrders) {
                    const daysLeft = Number(o.days_left);            // <= 0
                    const daysSinceExpire = Math.max(0, -daysLeft);  // 0=วันหมด, 1=ถัดไป, ...
                    if (daysSinceExpire < repeatDays) {
                        await sendLineMessage(o, lineChatAPI, "expired");
                    }
                }
            }
            
            const nearOnce = lineSetting.enableExpireOnlyOnce === 1 || 
                 lineSetting.enableExpireOnlyOnce === true || 
                 lineSetting.enableExpireOnlyOnce === '1';

            const nearExpireOrders = await productList.GetOrderNearExpire();
          
            for (const o of nearExpireOrders) {
                const days = Number(o.days_left);
                const threshold = Number(lineSetting.SetNearDate);
                if (nearOnce ? (days === threshold) : (days > 0 && days <= threshold)) {
                await sendLineMessage(o, lineChatAPI, "near");
                }
            }

            await MainModel.insert("daily_sent", { last_sent: timerHelper.getDateNowString() });
        }
    } catch (error) {
        console.log(error);
    }
}

async function sendLineMessage(tmpOrder, lineChatAPI, type) {
    let tmpRemark = tmpOrder['user_id'] + " " + tmpOrder['email'] + " " + tmpOrder['product_name'] + " เหลือ " + tmpOrder['days_left'] + " วัน";
    
    //console.log(tmpRemark);

    let row_user = await MemberList.findById(tmpOrder['user_id']);
    if (row_user.length <= 0) {
        tmpRemark = "Not found user : " + tmpOrder['user_id'];
        console.log(tmpRemark);
        return MainModel.insert("line_sent_message", {
            email: tmpOrder['email'],
            user_id: tmpOrder['user_id'],
            product_name: tmpOrder['product_id'] || 0, // ใช้ product_id แทน product_name
            send_at: timerHelper.getDateTimeNowString(),
            send_line_complete: 0,
            remark: tmpRemark
        });
    }

    // ใช้ user_id จาก line_contact แทน line_userid
    let sourceUserId = row_user["user_id"]; // line_contact.user_id = LINE User ID
    if (!sourceUserId) {
        tmpRemark = "No user_id found for user: " + tmpOrder['user_id'];
        
        return MainModel.insert("line_sent_message", {
            email: tmpOrder['email'],
            user_id: tmpOrder['user_id'],
            product_name: tmpOrder['product_id'] || 0, // ใช้ product_id แทน product_name
            send_at: timerHelper.getDateTimeNowString(),
            send_line_complete: 0,
            remark: tmpRemark
        });
    }

    let contact = await lineChatSetting.getContactByUserId(sourceUserId);
    if (!contact || contact.length === 0) {
        tmpRemark = "No LINE contact found for user: " + tmpOrder['user_id'];
        
        return MainModel.insert("line_sent_message", {
            email: tmpOrder['email'],
            user_id: tmpOrder['user_id'],
            product_name: tmpOrder['product_id'] || 0, // ใช้ product_id แทน product_name
            send_at: timerHelper.getDateTimeNowString(),
            send_line_complete: 0,
            remark: tmpRemark
        });
    }

    let tmpChatSetting = await lineChatSetting.findByBotUserId(contact[0]['bot_user_id']);

    if (tmpChatSetting['status'] != 1) {
        tmpRemark = "Line Bot Not Active for : " + tmpOrder['user_id'];
        
        return MainModel.insert("line_sent_message", {
            email: tmpOrder['email'],
            user_id: tmpOrder['user_id'],
            product_name: tmpOrder['product_id'] || 0, // ใช้ product_id แทน product_name
            send_at: timerHelper.getDateTimeNowString(),
            send_line_complete: 0,
            remark: tmpRemark
        });
    }

    let msg = "";
    if (type === "expired") {
        msg = "⏰ขณะนี้แพ็คเก็จ " + tmpOrder['product_name'] + " ของ " + tmpOrder['email'] + " ได้หมดอายุแล้ว\n";        
    } else if (type === "near"){
        //msg = `แพ็คเก็จ ${tmpOrder.product_name} ของ ${tmpOrder.email} กำลังจะหมดอายุในอีก ${tmpOrder.days_left} วัน\n`;
        msg = `⚠️แพ็คเก็จ ${tmpOrder['product_name']} ของคุณกำลังจะหมดอายุในอีก ${tmpOrder.days_left} วัน\n`
    }
    //  else if (type === "near") {
    //     msg = "แพ็คเก็จ " + tmpOrder['product_name'] + " ของ " + tmpOrder['email'] + " กำลังจะหมดอายุในอีก 3 วัน\n";
    // }
    
    msg += "📝กรุณากดลิ้งค์นี้เพื่อต่ออายุ \n";
    msg += oSecretkey.webDomain + "buyproduct?sourceUserId=" + sourceUserId + "&emailx=" + tmpOrder['email']+"&type="+tmpOrder['purchase_type']+"&shop_type=";

    if (tmpOrder['purchase_type']=='shop_personal') {
        msg +="0";
    }
    else if(tmpOrder['purchase_type']=='shop_family')
    {
        msg +="1";
    }    
    else if(tmpOrder['purchase_type']=='personal')
    {
        msg +="2";
    }
    else if(tmpOrder['purchase_type']=='email')
    {
        msg +="3";
    }

    msg += "&previous_order_id=" + tmpOrder['id'];

    // ส่ง LINE
    let channelToken = tmpChatSetting['channel_token'];
    lineChatAPI.setToken(channelToken);
    const tmpSend = await lineChatAPI.pushMessage(sourceUserId, msg);

    if (tmpSend['error']) {
        tmpRemark = "Line Push Message : " + tmpSend['error'];
        console.log(tmpRemark);
        return MainModel.insert("line_sent_message", {
            email: tmpOrder['email'],
            user_id: tmpOrder['user_id'],
            product_name: tmpOrder['product_id'] || 0, // ใช้ product_id แทน product_name
            send_at: timerHelper.getDateTimeNowString(),
            send_line_complete: 0,
            remark: tmpRemark
        });
    } else {
        tmpRemark = msg;
        console.log(`✅ ส่งข้อความสำเร็จให้ ${tmpOrder['email']} (${tmpOrder['user_id']}) - ${tmpOrder['product_name']} เหลือ ${tmpOrder['days_left']} วัน`);
        return MainModel.insert("line_sent_message", {
            email: tmpOrder['email'],
            user_id: tmpOrder['user_id'],
            product_name: tmpOrder['product_id'] || 0, // ใช้ product_id แทน product_name
            send_at: timerHelper.getDateTimeNowString(),
            send_line_complete: 1,
            remark: tmpRemark
        });
    }
}


// using as middleware

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/file', uploadFileRoutes);

app.use('/api/admin', adminListRoutes);

app.use('/api/adminsetting', adminSettingRoutes);

app.use('/api/promotion', promotionRoutes);

app.use('/api/popup', popupSetttingRoutes);

app.use('/api/lineconnect', lineLoginRoutes);

app.use('/api/member', memberRoutes);

app.use('/api/banner', bannerRoutes);

app.use('/api/announcement', announcementSettingRoutes);

app.use('/api/general', generalRoutes);

app.use('/api/adminbank', adminBankRoutes);

app.use('/api/refer', referListRoutes);

app.use('/api/otp', otpManageRoutes);

app.use('/api/product', productRoutes);

app.use('/api/transaction', transactionRoutes);

app.use('/api/staffgroup', staffGroupListRoutes);

app.use('/api/staff', staffListRoutes);

app.use('/api/interesttype', interestTypeRoutes);

app.use('/api/subscriptiontype', subscriptionTypeRoutes);

app.use('/api/subscriptiongroup', subscriptionGruopRoutes);

app.use('/api/loan', loanListRoutes);

app.use('/api/line', lineRoutes);

app.use('/api/report', reportRoutes);

app.use('/api/reportzend', reportZendRoutes);

const lineWebhookRoutes  =require('./src/routes/linewebhook.route');

app.use('/api/linechatsetting', lineChatSettingRoutes);

app.use('/api/linechat', lineChatRoutes);

app.use('/api/linecontact', lineContactRoutes);



app.use('/getfile/',express.static(path.join(__dirname, '/assets/')));

app.use('/getslipfile/',express.static(path.join(__dirname, '/slipfile/')));

//====================================================================
//ZEnd ==> Personal email

app.use('/api/usersemail', usersEmailRoutes);
app.use('/api/personalemail', personalEmailRoutes);
app.use('/api/personal_email', personalEmailNewRoutes);
app.use('/api/btnStatus', btnStatusRoutes);
app.use('/api/paymenttype', paymentTypeRoutes);


//====================================================================

const expressWs = require('express-ws')(app);
const uuid = require('uuid');
const MainModel = require('./src/models/main.model');
const timerHelper = require('./src/modules/timehelper');
const productList = require('./src/models/productlist.model');
const adminSettingList = require('./src/models/adminsetting.model');
const MemberList = require('./src/models/memberlist.model')
const lineChatSetting = require('./src/models/linechatsetting.model')

let wsConnections = [];
let lineWebhookRoutes2 = lineWebhookRoutes(wsConnections); 
app.use('/api/linewebhook', lineWebhookRoutes2);

app.ws('/api/linechat/wsconnect', function(ws, req) {
    
    console.log("Connected");    
    const id = uuid.v4();    
    ws.id = id;
    wsConnections.push(ws);
    console.log(wsConnections.length + " clients are connected");

    ws.send(`Server is connected`);

    ws.on('message', function(msg) {
        console.log(`${ws.id} sent message: ${msg}`);
    });

    ws.on('close', function() {        
        console.log("Closed Connection");
        wsConnections = wsConnections.filter(conn => conn.id !== ws.id);
    });
    
});

app.get('/api/linechat/wstest', function(req, res, next) {
    console.log("wstest");
    wsConnections.forEach(element => {
            console.log(element.id);
      });
  
    res.status(200).json({
        status: "success",
      });
      return;
    }
)

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
    console.log("404 File not found");
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    console.log(req.body);    
    res.status(404);
    // res.sendFile(path.join(__dirname, 'src/views/errorpage.html'));
});

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// const fs = require('fs');

// function writeTimestampToFile() {
//     const timestamp = new Date().toISOString();
//     const content = `module.exports = "${timestamp}";\n`;
  
//     fs.writeFile('restarttime.js', content, { flag: 'w' }, (err) => {
//       if (err) {
//         console.error('Error writing timestamp:', err);
//       } else {
//         console.log(`Timestamp "${timestamp}" written to restarttime.js`);
//       }
//     });
//   }
  
// function restartApp() {
//     const timestamp = new Date();
//     console.log(timestamp);
//     console.log('Restarting the application...');
  
//     writeTimestampToFile();
  
//   }
  
//   function scheduleRestart() {
//     const restartInterval = 30 * 60 * 1000; // 1 hour in milliseconds
//     setTimeout(restartApp, restartInterval);    
//   }

// scheduleRestart();
  