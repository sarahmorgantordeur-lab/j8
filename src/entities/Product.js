const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Product",
    tableName: "products",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        price: {
            type: "decimal", // Use decimal for money
            precision: 10,
            scale: 2,
        },
        stock: {
            type: "int",
        },
        description: {
            type: "text",
            nullable: true,
        },
        isArchived: {
            type: "boolean",
            default: false,
        },
    },
});
