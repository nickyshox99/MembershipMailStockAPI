'use strict';

const Report = require('../models/report.modal');

exports.getMonthlyExpenseReport = async function (req, res) {
    res.status(200).json({
        status: 'success',
        message: '',
        auth: true,
        data: await Report.getMonthlyExpenseReport(),
    });
};
