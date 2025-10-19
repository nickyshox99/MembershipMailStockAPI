const dbConn = require('../../config/db.config');

class PaymentTypeModel {
  constructor() {
    this.tableName = 'payment_type';
  }

  // Get all payment types
  async findAll() {
    try {
      const query = `SELECT * FROM ${this.tableName} ORDER BY id ASC`;
      const result = await dbConn.raw(query);
      return result[0];
    } catch (error) {
      console.error('Error in PaymentTypeModel.findAll:', error);
      throw error;
    }
  }

  // Get payment type by ID
  async findById(id) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      const result = await dbConn.raw(query, [id]);
      return result[0].length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error('Error in PaymentTypeModel.findById:', error);
      throw error;
    }
  }

  // Get payment type by type_code
  async findByTypeCode(typeCode) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE type_code = ?`;
      const result = await dbConn.raw(query, [typeCode]);
      return result[0].length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error('Error in PaymentTypeModel.findByTypeCode:', error);
      throw error;
    }
  }

  // Create new payment type
  async create(data) {
    try {
      const { type_code, type_name } = data;
      const query = `INSERT INTO ${this.tableName} (type_code, type_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`;
      const result = await dbConn.raw(query, [type_code, type_name]);
      return result[0].insertId;
    } catch (error) {
      console.error('Error in PaymentTypeModel.create:', error);
      throw error;
    }
  }

  // Update payment type
  async update(id, data) {
    try {
      const { type_code, type_name } = data;
      const query = `UPDATE ${this.tableName} SET type_code = ?, type_name = ?, updated_at = NOW() WHERE id = ?`;
      const result = await dbConn.raw(query, [type_code, type_name, id]);
      return result[0].affectedRows > 0;
    } catch (error) {
      console.error('Error in PaymentTypeModel.update:', error);
      throw error;
    }
  }

  // Delete payment type
  async delete(id) {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
      const result = await dbConn.raw(query, [id]);
      return result[0].affectedRows > 0;
    } catch (error) {
      console.error('Error in PaymentTypeModel.delete:', error);
      throw error;
    }
  }

  // Check if type_code exists (for validation)
  async isTypeCodeExists(typeCode, excludeId = null) {
    try {
      let query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE type_code = ?`;
      let params = [typeCode];
      
      if (excludeId) {
        query += ` AND id != ?`;
        params.push(excludeId);
      }
      
      const result = await dbConn.raw(query, params);
      return result[0][0].count > 0;
    } catch (error) {
      console.error('Error in PaymentTypeModel.isTypeCodeExists:', error);
      throw error;
    }
  }

  // Get paginated payment types
  async findWithPagination(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      let query = `SELECT * FROM ${this.tableName}`;
      let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
      let params = [];

      if (search) {
        const searchCondition = ` WHERE type_name LIKE ? OR type_code LIKE ?`;
        query += searchCondition;
        countQuery += searchCondition;
        params = [`%${search}%`, `%${search}%`];
      }

      query += ` ORDER BY id ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [data, countResult] = await Promise.all([
        dbConn.raw(query, params),
        dbConn.raw(countQuery, params.slice(0, -2)) // Remove limit and offset from count query
      ]);

      return {
        data: data[0],
        total: countResult[0][0].total,
        page,
        limit,
        totalPages: Math.ceil(countResult[0][0].total / limit)
      };
    } catch (error) {
      console.error('Error in PaymentTypeModel.findWithPagination:', error);
      throw error;
    }
  }
}

module.exports = new PaymentTypeModel();
