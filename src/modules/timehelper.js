
var timerHelper = function() {
    
};

timerHelper.getDateNowString =  function() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = '' +d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

timerHelper.getSCBDateNowString =  function() {
    var d = new Date();
    d.setHours(d.getHours()+7);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = '' +d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

timerHelper.getDateNowYesterdayString =  function() {
    var d = new Date();
    d.setDate(d.getDate() - 1);

    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = '' +d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

timerHelper.getSCBDateNowYesterdayString =  function() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(d.getHours()+7);

    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = '' +d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

timerHelper.getDateTimeNowString = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year ='' + d.getFullYear();
        hour ='' + d.getHours();
        min ='' + d.getMinutes();
        sec ='' + d.getSeconds();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (hour.length < 2) 
        hour = '0' + hour;

    if (min.length < 2) 
        min = '0' + min;

    if (sec.length < 2) 
        sec = '0' + sec;

    let returnValue = [year, month, day].join('-');
    returnValue += "T"+hour.toString()+":"+min.toString()+":"+sec.toString();

    return returnValue;
}

timerHelper.getDateTimeNowStringNoT = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year ='' + d.getFullYear();
        hour ='' + d.getHours();
        min ='' + d.getMinutes();
        sec ='' + d.getSeconds();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (hour.length < 2) 
        hour = '0' + hour;

    if (min.length < 2) 
        min = '0' + min;

    if (sec.length < 2) 
        sec = '0' + sec;

    let returnValue = [year, month, day].join('-');
    returnValue += " "+hour.toString()+":"+min.toString()+":"+sec.toString();

    return returnValue;
}

timerHelper.getDateTimeNowStringNumberOnly = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year ='' + d.getFullYear();
        hour ='' + d.getHours();
        min ='' + d.getMinutes();
        sec ='' + d.getSeconds();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (hour.length < 2) 
        hour = '0' + hour;

    if (min.length < 2) 
        min = '0' + min;

    if (sec.length < 2) 
        sec = '0' + sec;

    let returnValue = [year, month, day].join('');
    returnValue += hour.toString()+min.toString()+sec.toString();

    return returnValue;
}

timerHelper.getDateTimeNowShortStringNumberOnly = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year ='' + d.getFullYear();
        hour ='' + d.getHours();
        

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (hour.length < 2) 
        hour = '0' + hour;

    let returnValue = [year, month, day].join('');
    returnValue += hour.toString();

    return returnValue;
}

timerHelper.getDateTimeStringNoSign = function(){
    var tmpDate = new Date();
    return tmpDate.getFullYear().toString()+tmpDate.getMonth().toString()+tmpDate.getDate().toString()+tmpDate.getHours().toString()+tmpDate.getMinutes().toString()+tmpDate.getSeconds().toString();

}

timerHelper.convertDatetimeToString = function (dTime)
{
    var d = new Date(dTime),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear();
    hour = '' +d.getHours();
    min = '' +d.getMinutes();
    sec = '' +d.getSeconds();
    
    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (hour.length < 2) 
        hour = '0' + hour;

    if (min.length < 2) 
        min = '0' + min;

    if (sec.length < 2) 
        sec = '0' + sec;

    let returnValue = [year, month, day].join('-');
    returnValue += "T"+hour.toString()+":"+min.toString()+":"+sec.toString();

    return returnValue;
}

timerHelper.convertDatetimeToStringNoT = function (dTime)
{
    var d = new Date(dTime),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year ='' + d.getFullYear();
    hour ='' + d.getHours();
    min = '' +d.getMinutes();
    sec ='' + d.getSeconds();
    
    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (hour.length < 2) 
        hour = '0' + hour;

    if (min.length < 2) 
        min = '0' + min;

    if (sec.length < 2) 
        sec = '0' + sec;

    let returnValue = [year, month, day].join('-');
    returnValue += " "+hour.toString()+":"+min.toString()+":"+sec.toString();

    return returnValue;
}

timerHelper.convertDateToString = function (dTime)
{
    var d = new Date(dTime),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear();
    
    
    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    

    let returnValue = [year, month, day].join('-');    
    return returnValue;
}

module.exports = timerHelper;