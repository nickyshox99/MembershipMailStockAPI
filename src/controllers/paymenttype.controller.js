const PaymentTypeModel = require('../models/paymenttype.model');

class PaymentTypeController {
  // Get all payment types
  async getAllPaymentTypes(req, res) {
    try {
      const { page, limit, search } = req.query;
      
      if (page && limit) {
        // Paginated response
        const result = await PaymentTypeModel.findWithPagination(
          parseInt(page) || 1,
          parseInt(limit) || 10,
          search || ''
        );
        
        return res.status(200).json({
          status: 'success',
          data: result.data,
          pagination: {
            currentPage: result.page,
            totalPages: result.totalPages,
            totalItems: result.total,
            itemsPerPage: result.limit
          }
        });
      } else {
        // Get all without pagination
        const paymentTypes = await PaymentTypeModel.findAll();
        
        return res.status(200).json({
          status: 'success',
          data: paymentTypes
        });
      }
    } catch (error) {
      console.error('Error in getAllPaymentTypes:', error);
      return res.status(500).json({
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทการชำระเงิน'
      });
    }
  }

  // Get payment type by ID
  async getPaymentTypeById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          message: 'ID ไม่ถูกต้อง'
        });
      }

      const paymentType = await PaymentTypeModel.findById(id);
      
      if (!paymentType) {
        return res.status(404).json({
          status: 'error',
          message: 'ไม่พบประเภทการชำระเงินที่ระบุ'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: paymentType
      });
    } catch (error) {
      console.error('Error in getPaymentTypeById:', error);
      return res.status(500).json({
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทการชำระเงิน'
      });
    }
  }

  // Get payment type by type_code
  async getPaymentTypeByCode(req, res) {
    try {
      const { code } = req.params;
      
      if (!code) {
        return res.status(400).json({
          status: 'error',
          message: 'Type code ไม่ถูกต้อง'
        });
      }

      const paymentType = await PaymentTypeModel.findByTypeCode(code);
      
      if (!paymentType) {
        return res.status(404).json({
          status: 'error',
          message: 'ไม่พบประเภทการชำระเงินที่ระบุ'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: paymentType
      });
    } catch (error) {
      console.error('Error in getPaymentTypeByCode:', error);
      return res.status(500).json({
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประเภทการชำระเงิน'
      });
    }
  }

  // Create new payment type
  async createPaymentType(req, res) {
    try {
      const { type_code, type_name } = req.body;

      // Validation
      if (!type_code || !type_name) {
        return res.status(400).json({
          status: 'error',
          message: 'กรุณากรอกข้อมูลให้ครบถ้วน (type_code, type_name)'
        });
      }

      // Check if type_code already exists
      const existingType = await PaymentTypeModel.isTypeCodeExists(type_code);
      if (existingType) {
        return res.status(409).json({
          status: 'error',
          message: 'Type code นี้มีอยู่แล้วในระบบ'
        });
      }

      const newId = await PaymentTypeModel.create({
        type_code: type_code.trim(),
        type_name: type_name.trim()
      });

      // Get the created record
      const createdPaymentType = await PaymentTypeModel.findById(newId);

      return res.status(201).json({
        status: 'success',
        message: 'สร้างประเภทการชำระเงินสำเร็จ',
        data: createdPaymentType
      });
    } catch (error) {
      console.error('Error in createPaymentType:', error);
      return res.status(500).json({
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการสร้างประเภทการชำระเงิน'
      });
    }
  }

  // Update payment type
  async updatePaymentType(req, res) {
    try {
      const { id } = req.params;
      const { type_code, type_name } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          message: 'ID ไม่ถูกต้อง'
        });
      }

      // Check if payment type exists
      const existingPaymentType = await PaymentTypeModel.findById(id);
      if (!existingPaymentType) {
        return res.status(404).json({
          status: 'error',
          message: 'ไม่พบประเภทการชำระเงินที่ระบุ'
        });
      }

      // Validation
      if (!type_code || !type_name) {
        return res.status(400).json({
          status: 'error',
          message: 'กรุณากรอกข้อมูลให้ครบถ้วน (type_code, type_name)'
        });
      }

      // Check if type_code already exists (excluding current record)
      const isCodeExists = await PaymentTypeModel.isTypeCodeExists(type_code, id);
      if (isCodeExists) {
        return res.status(409).json({
          status: 'error',
          message: 'Type code นี้มีอยู่แล้วในระบบ'
        });
      }

      const updated = await PaymentTypeModel.update(id, {
        type_code: type_code.trim(),
        type_name: type_name.trim()
      });

      if (!updated) {
        return res.status(500).json({
          status: 'error',
          message: 'ไม่สามารถอัปเดตข้อมูลได้'
        });
      }

      // Get the updated record
      const updatedPaymentType = await PaymentTypeModel.findById(id);

      return res.status(200).json({
        status: 'success',
        message: 'อัปเดตประเภทการชำระเงินสำเร็จ',
        data: updatedPaymentType
      });
    } catch (error) {
      console.error('Error in updatePaymentType:', error);
      return res.status(500).json({
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการอัปเดตประเภทการชำระเงิน'
      });
    }
  }

  // Delete payment type
  async deletePaymentType(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          status: 'error',
          message: 'ID ไม่ถูกต้อง'
        });
      }

      // Check if payment type exists
      const existingPaymentType = await PaymentTypeModel.findById(id);
      if (!existingPaymentType) {
        return res.status(404).json({
          status: 'error',
          message: 'ไม่พบประเภทการชำระเงินที่ระบุ'
        });
      }

      const deleted = await PaymentTypeModel.delete(id);

      if (!deleted) {
        return res.status(500).json({
          status: 'error',
          message: 'ไม่สามารถลบข้อมูลได้'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'ลบประเภทการชำระเงินสำเร็จ'
      });
    } catch (error) {
      console.error('Error in deletePaymentType:', error);
      return res.status(500).json({
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการลบประเภทการชำระเงิน'
      });
    }
  }

  // Bulk delete payment types
  async bulkDeletePaymentTypes(req, res) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'กรุณาระบุ ID ที่ต้องการลบ'
        });
      }

      let deletedCount = 0;
      let errors = [];

      for (const id of ids) {
        try {
          const existingPaymentType = await PaymentTypeModel.findById(id);
          if (existingPaymentType) {
            const deleted = await PaymentTypeModel.delete(id);
            if (deleted) {
              deletedCount++;
            }
          }
        } catch (error) {
          errors.push(`ID ${id}: ${error.message}`);
        }
      }

      return res.status(200).json({
        status: 'success',
        message: `ลบข้อมูลสำเร็จ ${deletedCount} รายการ`,
        deletedCount,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      console.error('Error in bulkDeletePaymentTypes:', error);
      return res.status(500).json({
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการลบข้อมูลหลายรายการ'
      });
    }
  }
}

module.exports = new PaymentTypeController();
