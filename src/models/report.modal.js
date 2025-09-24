'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'subscription_group_payment';
const tableKey = 'id'

//User object create
let Report = async function() {
    
};

Report.getMonthlyExpenseReport = async function(result) {
    let sqlStr = "Select id, paid_amount FROM "+tableName+" WHERE 1=1";
    const datas = await dbConn.raw(sqlStr);
    
    // Calculate total paid amount
    let totalPaidAmount = 0;
    const formattedData = datas[0].map(item => {
        totalPaidAmount += parseFloat(item.paid_amount);
        return {
            id: item.id,
            paid_amount: item.paid_amount
        };
    });
    
    return {
        data: formattedData,
        total_paid_amount: totalPaidAmount.toFixed(2)
    };
};

module.exports = Report;