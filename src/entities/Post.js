const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Post",
    tableName: "posts",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        title: {
            type: "varchar",
        },
        content: {
            type: "text",
        },
        tags: {
            type: "simple-array",
        },
        created_at: {
            type: "datetime",
        },
    },
});
