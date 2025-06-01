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

const lineChatSettingRoutes  =require('./src/routes/linechatsetting.route');
const lineChatRoutes  =require('./src/routes/linechat.route');

const lineRoutes = require('./src/routes/line.route');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

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

const lineWebhookRoutes  =require('./src/routes/linewebhook.route');

app.use('/api/linechatsetting', lineChatSettingRoutes);

app.use('/api/linechat', lineChatRoutes);

app.use('/getfile/',express.static(path.join(__dirname, '/assets/')));

app.use('/getslipfile/',express.static(path.join(__dirname, '/slipfile/')));

//====================================================================

const expressWs = require('express-ws')(app);
const uuid = require('uuid');

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
  