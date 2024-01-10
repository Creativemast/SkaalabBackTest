/**
 * PACKAGES
 */
require('dotenv/config');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

/**
 * ROUTES
 */
const IndexRoute = require('./routes/index');
const AuthRoute = require('./routes/auth');
const TasksRoute = require('./routes/tasks');
const UsersRoute = require('./routes/users');
const StatsRoute = require('./routes/stats');

const app = express();
const server = require('http').createServer(app);

app.use(compression());
process.env.MONGO_LOCAL_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ 'type': '*/*', limit: '20mb' }));
app.use(express.static(path.resolve('./public')));

mongoose.connect(process.env.MONGO_LOCAL_URL, {
    socketTimeoutMS: 480000,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    connectTimeoutMS: 30000,
    useNewUrlParser: true
});

mongoose.connection.once('open', () => console.log('Database connection established successfully!'))
    .on('error', () => console.log('Error when connecting to database!'));

app.use((req, res, next) => {
    let log = {
        request: {
            "Original Url": req.originalUrl,
            "IP": req.ip,
            "method": req.method,
            "time": new Date().toUTCString(),
        },
        response: {
            "status": res.statusCode,
            "time": new Date().toUTCString(),
        }
    }
    console.table(log);
    next();
});
app.use('/', IndexRoute);
app.use('/auth', AuthRoute);
app.use('/tasks', TasksRoute);
app.use('/users', UsersRoute);
app.use('/stats', StatsRoute);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var port = process.env.PORT || 4000;
server.listen(port, () => console.log('Express server runing on port ' + port));