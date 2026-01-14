const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy(times) {
        // Stop retrying after 3 attempts
        if (times > 3) {
            console.warn('⚠️  Redis unavailable - session persistence disabled');
            return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
    console.log('✅ Redis Ready');
});

redis.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        // Don't spam console with connection errors
        return;
    }
    console.error('Redis Error:', err);
});

module.exports = redis;
