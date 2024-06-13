class SmsLib {
    
    smsThAll(text) {
        let row = {};
        
        if (text.indexOf('เข้าx') !== -1) {
            if (text.indexOf('จาก') !== -1) {
                //AnotherBank
                let match1 = text.match(/จาก(.*?)เข้า/);
                if (match1 && match1[1]) {
                    let acc = match1[1].split('x');
                    row.acc = acc[1];
                    row.bank_app = acc[0].replace(/\//g, "");
                }

                let match2 = text.match(/ (.*?) จาก/);
                if (match2 && match2[1]) {
                    row.credit = match2[1].replace(/,/g, "");
                }

                let match3 = text.match(/(.*?) /);
                if (match3 && match3[1]) {
                    let tmp_time = match3[1].split("@");

                    row.time = tmp_time[1] + ":00";

                    let tmp_2 = tmp_time[0].split("/");

                    row.date = new Date().getFullYear() + "-" + tmp_2[1] + "-" + tmp_2[0];
                }

                row.datetime = row.date + " " + row.time;
                row.bankdesc = text;
            } else {
                //SCBBank

                row.acc = null;
                row.bank_app = "SCB";

                let match2 = text.match(/ (.*?) /);
                if (match2 && match2[1]) {
                    row.credit = match2[1].replace(/,/g, "");
                }

                let match3 = text.match(/(.*?) /);
                if (match3 && match3[1]) {
                    let tmp_time = match3[1].split("@");

                    row.time = tmp_time[1] + ":00";

                    let tmp_2 = tmp_time[0].split("/");

                    row.date = new Date().getFullYear() + "-" + tmp_2[1] + "-" + tmp_2[0];
                }

                row.datetime = row.date + " " + row.time;
                row.bankdesc = text;
            }
        }

        return row;
    }

    sms(txt) {
        let row = {};

        if (txt) {
            let sms = txt;

            if (sms.indexOf('Transfer') !== -1) {
                if (sms.indexOf('from') !== -1) {
                    let match1 = sms.match(/from (.*?) /);
                    if (match1 && match1[1]) {
                        let acc = match1[1].split('x');
                        row.acc = acc[1];
                        row.bank_app = acc[0].replace(/\//g, "");
                    }
                }

                if (sms.indexOf('THB') !== -1) {
                    let match2 = sms.match(/THB (.*?) to/);
                    if (match2 && match2[1]) {
                        row.credit = match2[1].replace(/,/g, "");
                    }
                }

                if (sms.indexOf('on') !== -1) {
                    let match3 = sms.match(/on (.*?)  Available/);
                    if (!match3) {
                        match3 = sms.match(/on (.*?)  - SMS from/);
                    }

                    if (match3 && match3[1]) {
                        let tmp_time = match3[1].split("@");

                        row.time = tmp_time[1] + ":00";

                        let tmp_2 = tmp_time[0].split("/");

                        row.date = new Date().getFullYear() + "-" + tmp_2[1] + "-" + tmp_2[0];

                        row.datetime = row.date + " " + row.time;
                    }
                }
            }
            else
            {
                return null
            }
        }

        return row;
    }
    
    sms_scb(txt) {
        let row = {};

        if (txt) {
            let sms = txt;

            if (sms.indexOf('Transfer') !== -1) {
                row.acc = "";
                row.bank_app = "SCB";

                if (sms.indexOf('THB') !== -1) {
                    let match = sms.match(/THB (.*?) to/);
                    if (match && match[1]) {
                        row.credit = match[1].replace(/,/g, "");
                    }
                }

                if (sms.indexOf('on') !== -1) {
                    let match = sms.match(/on (.*?)  Available/);
                    if (!match) {
                        match = sms.match(/on (.*?)  - SMS from/);
                    }

                    if (match && match[1]) {
                        let tmp_time = match[1].split("@");

                        row.time = tmp_time[1].replace(/\./g, "") + ":00";

                        let tmp_2 = tmp_time[0].split("/");

                        row.date = new Date().getFullYear() + "-" + tmp_2[1] + "-" + tmp_2[0];

                        row.datetime = row.date + " " + row.time;
                    }
                }
            }
        }

        return row;
    }
    
    
}

module.exports = SmsLib;