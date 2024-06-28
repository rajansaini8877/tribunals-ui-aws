const connectRedis = require('../config/redis');

const saveToCache = async (key, value) => {
    try {
        const redis = connectRedis();

        if(redis) {
            const data = await redis.set(key, value, 'PX', 604800000); //7 days ttl
            if(data) {
                console.log("Saved to cache");
                return true;
            }
        }
        console.log("Unable to save to cache");
        return false;
    }
    catch(err) {
        console.log("Unable to save to cache: " + err.message);
        return false;
    }
}

const fetchFromCache = async(key) => {
    try {
        console.log("Inside fetch from cache");
        const redis = connectRedis();
        console.log("Inside fetch from cache: After connect redis");
        if(redis) {
            const data = await redis.get(key);
            console.log("Inside fetch from cache: After get");
            if(data) {
                console.log("Fetched from cache");
                return data;
            }
        }
        console.log("Unable to fetch from cache: Not found");
        return false;
    }
    catch(err) {
        console.log("Unable to fetch from cache: " + err.message);
        return false;
    }
}

const flushCache = async() => {
    try {
        const redis = connectRedis();
        if(redis) {
            const data = redis.keys("*").then((keys) => {
                let pipeline = redis.pipeline();
                keys.forEach((key) => {
                    pipeline.del(key);
                });
                return pipeline.exec();
            });
            if(data) {
                console.log("Cache flushed successfully!");
                return data;
            }
        }
        console.log("Could not flush cache: No data");
        return false;
    }
    catch(err) {
        console.log("Could not flush cache: " + err.message);
        return false;
    }
}

module.exports = {
    saveToCache,
    fetchFromCache,
    flushCache
}