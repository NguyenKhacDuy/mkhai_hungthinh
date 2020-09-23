const db = require('../Models')
const Department = db.Department
const License = db.License
const Document = db.Document
const crypto = require('crypto')
const moment = require('moment')

module.exports = function(sequelize, Sequelize) {
    const User = sequelize.define("User", {
        id: { 
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullname: { 
            type: Sequelize.STRING,
            isAlpha: true,
            len: [2, 100]
        },
        dob: { type: Sequelize.STRING },
        role: { 
            type: Sequelize.INTEGER,
            allowNull: false,
            isInt: true,
            get() {
                const role = this.getDataValue('role');
                if(role == 0) {
                    return 'Creator';
                }

                if(role == 1) {
                    return 'Approver';
                }

                if(role == 2) {
                    return 'Accountant';
                }
                // return role == 0 ? 'Creator' : (role == 1 ? 'Approver' : 'Accountant')
            }
        },
        address: { type: Sequelize.STRING },
        phone: { 
            type: Sequelize.STRING,
            isNumeric: true,
            len: [7, 20]
        },
        username: { 
            type: Sequelize.STRING,
            isAlphanumeric: true,
            len: [8, 20]
        },
        password: { 
            type: Sequelize.STRING,
            len: [1, 64],
            set(password) {
                this.setDataValue('password', crypto.createHash('sha1').update(password).digest('base64'))
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1
        },
        departmentId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Department',
                key: 'id'
            }
        }
    });
    User.associate = function(models) {
        User.belongsTo(models.Department, {foreignKey: 'departmentId'});
        User.hasMany(models.License, {foreignKey: 'creatorId',sourceKey: 'id'});
        User.hasMany(models.License, {foreignKey: 'approverId',sourceKey: 'id'});
        User.hasMany(models.License, {foreignKey: 'accountantId',sourceKey: 'id'});
        User.hasMany(models.Document, {foreignKey: 'creatorId',sourceKey: 'id'});
    };
    return User;
};