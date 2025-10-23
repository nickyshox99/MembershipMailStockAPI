'use strict';
const jwt = require('jsonwebtoken');
const Btn = require('../models/btn.model');

exports.GetBtnStatus = async function (req, res) {
    try {
        const btnStatus = await Btn.getBtnStatus();
        res.status(200).json(
            {
                status: 'success',
                message: 'get btn status success',
                auth: true,
                data: btnStatus,
            }
        );
        return;
    } catch (error) {
        console.error('GetBtnStatus Error:', error);
        res.status(202).json(
            {
                status: 'error',
                message: error.message || 'Unknown error occurred',
                auth: false,
                data: null,
            }
        );
        return;
    }
};