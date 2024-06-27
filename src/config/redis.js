const Redis = require('ioredis');

let redisConn;

const connectRedis = () => {
    if(!redisConn) {
        const config = { maxRetriesPerRequest: 1 };

        config.host = "appeals-cache.wqbzba.ng.0001.use1.cache.amazonaws.com";
        config.port = 6379;
        config.tls = { rejectUnauthorized: false,
            maxVersion: 'TLSv1.3',
            minVersion: 'TLSv1.1',
         };

        redisConn = new Redis(config);

        redisConn.on("error", (err) => {
            console.log("Redis connect failed: "+err.message);
            redisConn = null;
        })
    }

    return redisConn;
}

module.exports = connectRedis;