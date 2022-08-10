require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./routes');
const globalErrorHandler = require('./utils/globalErrorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(globalErrorHandler);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        const port = process.env.PORT;
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server running on port ${port} with ${process.env.NODE_ENV} environment`);
        });
    });
