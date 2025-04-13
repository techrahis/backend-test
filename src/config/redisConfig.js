import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls:
    process.env.REDIS_TLS_SSL === "true"
      ? { servername: process.env.REDIS_HOST }
      : undefined,
});

export default redis;
