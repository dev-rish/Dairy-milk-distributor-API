require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const routes = require('./routes');
const globalErrorHandler = require('./utils/globalErrorHandler');

const env = process.env.NODE_ENV;
const port = process.env.PORT;

const swaggerSpecs = swaggerJsDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Milk Distributor API',
            version: '1.0.0',
            description: 'API to manage, add, update milk orders. Also enable tracking milk capacity left for a particular day',
        },
    },
    apis: ['./models/*.js', './routes/*.js'],
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use('/api', routes);

app.use(globalErrorHandler);

mongoose
    .connect(env === 'production' ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV)
    .then(() => {
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server running on port ${port} with ${env} environment`);
        });
    });
