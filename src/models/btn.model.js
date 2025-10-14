'use strict';

var dbConn = require('../../config/db.config');


var Btn = function () {

};

Btn.getBtnStatus = async function () {
    const datas = await dbConn.raw("SELECT * FROM button_visibility");
    return datas[0];
};

module.exports = Btn;