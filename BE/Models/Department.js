module.exports = function(sequelize, Sequelize) {
    const Department = sequelize.define("Department", {
        id: { 
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        departmentName: { 
            type: Sequelize.STRING
        },
        address: {
          type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: 'True'
        }
    });
    Department.associate = function(models) {
        Department.hasOne(models.User, {foreignKey: 'departmentId',sourceKey: 'id'});
        Department.hasOne(models.License, {foreignKey: 'departmentId',sourceKey: 'id'});
        Department.hasMany(models.Document, {foreignKey: 'departmentId',sourceKey: 'id'});
    };
    return Department;
};