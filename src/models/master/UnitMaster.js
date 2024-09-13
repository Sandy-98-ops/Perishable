import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";


const UnitMaster = sequelize.define("UnitMaster", {
    unit_master_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    unit_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sub_unit_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    conversion_ratio: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "unit_master",
    timeStamp: true
});

export default UnitMaster;