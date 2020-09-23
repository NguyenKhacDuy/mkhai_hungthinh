module.exports = function(sequelize, Sequelize) {
    const Document = sequelize.define("Document", {
        id: { 
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: { 
            type: Sequelize.STRING
        },
        title: {
          type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: 'True'
        },
        type: {
            type: Sequelize.INTEGER,
        },
        creatorId: {
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
        files: {
          type: Sequelize.STRING
        },
    });
    Document.associate = function(models) {
        Document.belongsTo(models.Department, {foreignKey: 'departmentId'});
        Document.belongsTo(models.User, {as: 'Creator', foreignKey: 'creatorId'});
    };
    return Document;
};