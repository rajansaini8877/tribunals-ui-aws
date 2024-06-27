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
        const redis = connectRedis();

        if(redis) {
            const data = await redis.get(key);
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

module.exports = {
    saveToCache,
    fetchFromCache
}