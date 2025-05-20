import fs from 'fs';
import { createClient, RedisClientType } from 'redis';

const passwordFilePath = process.env.REDIS_PASSWORD_FILE!;
if (!fs.existsSync(passwordFilePath)) {
  throw new Error(`Password file not found at path: ${passwordFilePath}`);
}

// Read Redis password and build the connection URL
const redisPassword: string = fs.readFileSync(process.env.REDIS_PASSWORD_FILE as string, 'utf8').trim();
const redisUrl: string = `redis://:${redisPassword}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

// Create and connect Redis client
const redisClient: RedisClientType = createClient({
  url: redisUrl
});

(async () => {
  await redisClient.connect();
  console.info('Connected to Redis');
})().catch(err => console.error('Redis connection error:', { err }));

export default redisClient;
