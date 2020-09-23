const config = require('../config')
const db = require('../Models')
const hostname = config.hostname
const port = config.port
const Department = db.Department
const User = db.User

module.exports = function(sequelize, Sequelize) {
    const License = sequelize.define("License", {
        id: { 
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: { 
            type: Sequelize.STRING
        },
        cancelReason: { 
            type: Sequelize.STRING
        },
        note: { 
            type: Sequelize.STRING
        },
        money: { 
            type: Sequelize.FLOAT
        },
        status: { 
            type: Sequelize.INTEGER
        },
        creatorId: { 
            type: Sequelize.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            },
            isInt: true,
            allowNull: false
        }, 
        approverId: { 
            type: Sequelize.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            },
            isInt: true
        },
        accountantId: { 
            type: Sequelize.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            },
            isInt: true
        },
        departmentId: { 
            type: Sequelize.INTEGER,
            references: {
                model: 'Department',
                key: 'id'
            },
            isInt: true
        },
        images: { 
            type: Sequelize.STRING,
            get() {
                const images = JSON.parse(this.getDataValue('Images'))
                return images.map(image => (`http://${hostname}:${port}/static/${image}`))
            }
        }
    });
    License.associate = function(models) {
        License.belongsTo(models.User, {as: 'Creator', foreignKey: 'creatorId'});
        License.belongsTo(models.User, {as: 'Approver',foreignKey: 'approverId'});
        License.belongsTo(models.User, {as: 'Accountant',foreignKey: 'accountantId'});
        License.belongsTo(models.Department, {foreignKey: 'departmentId'});
    };
    return License;
};