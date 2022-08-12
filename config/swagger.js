module.exports = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Milk Distributor API',
            version: '1.0.0',
            description: 'API to manage, add, update milk orders. Also enable tracking milk capacity left for a particular day',
        },
    },
    apis: ['./models/*.js', './routes/*.js'],
};
