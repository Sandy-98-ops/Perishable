import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import ItemCategory from "../master/ItemCategory.js";
import UnitMaster from "../master/UnitMaster.js";


const Item = sequelize.define("Item", {
    item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    item_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    item_category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: ItemCategory,
            key: 'item_category_id'
        }
    },
    unit_id: {
        type: DataTypes.INTEGER,
        references: {
            model: UnitMaster,
            key: 'unit_master_id'
        },
    },
    sub_unit_id: {
        type: DataTypes.INTEGER
    },
    image: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    tableName: 'item',
    timestamps: true
});


export default Item;