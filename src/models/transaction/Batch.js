import { DataTypes, DATE, DECIMAL, STRING } from "sequelize";
import sequelize from "../../config/db.js";
import Item from "./Item.js";

const Batch = sequelize.define("Batch", {
    batch_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key : 'item_id'
        }
    },
    batch_name: {
        type: STRING,
        allowNull: false
    },
    creation_date: {
        type: DATE,
        allowNull: false
    },
    initial_stock: {
        type: DECIMAL,
        defaultValue: 0.0
    },
}, {
    sequelize,
    tableName: "batch",
    timestamps: true
});

export default Batch;