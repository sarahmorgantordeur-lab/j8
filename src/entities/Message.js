const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Message',
    tableName: 'messages',
    columns: {
        id: {
            primary: true,
            type: 'integer',
            generated: 'increment',
        },
        content: {
            type: 'text',
        },
        room: {
            type: 'varchar',
            default: 'general',
        },
        createdAt: {
            type: 'datetime',
            createDate: true,
        },
    },
    relations: {
        sender: {
            type: 'many-to-one',
            target: 'User',
            eager: true,
            joinColumn: true,
        },
    },
});
