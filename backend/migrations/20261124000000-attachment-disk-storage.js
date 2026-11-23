'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// attachments move off base64-in-MySQL onto local disk (see uploadPaths.js) -
// scales far better and keeps the DB small. Existing rows that still have
// raw blob data get written out to a file and backfilled with a file_path
// so nothing already uploaded is lost.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Attachments', 'file_path', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Attachments', 'data', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });

    const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../uploads'));
    fs.mkdirSync(uploadDir, { recursive: true });

    const [rows] = await queryInterface.sequelize.query(
      'SELECT id, file_name, data FROM Attachments WHERE data IS NOT NULL'
    );
    for (const row of rows) {
      const ext = path.extname(row.file_name || '') || '';
      const diskName = `${crypto.randomUUID()}${ext}`;
      fs.writeFileSync(path.join(uploadDir, diskName), row.data);
      await queryInterface.sequelize.query(
        'UPDATE Attachments SET file_path = ?, data = NULL WHERE id = ?',
        { replacements: [diskName, row.id] }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Attachments', 'file_path');
  },
};
