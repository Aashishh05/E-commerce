import redis from "redis";

const rawClient = redis.createClient({
  url: process.env.REDIS_URL || undefined,
  socket: process.env.REDIS_URL
    ? undefined
    : {
        host: "localhost",
        port: 6379,
      },
});

rawClient.on("error", (err) => {
  console.log("Redis Client Error", err.message);
});

rawClient.on("connect", () => {
  console.log("Connected to Redis");
});

let isConnected = false;

const connectRedis = async () => {
  try {
    await rawClient.connect();
    isConnected = true;
  } catch (err) {
    console.log("Redis unavailable, continuing without cache:", err.message);
    isConnected = false;
  }
};

connectRedis();

const safeGet = async (key) => {
  if (!isConnected) return null;
  try {
    return await rawClient.get(key);
  } catch {
    return null;
  }
};

const safeSet = async (key, value, opts) => {
  if (!isConnected) return;
  try {
    if (opts) return await rawClient.set(key, value, opts);
    return await rawClient.set(key, value);
  } catch {
    return;
  }
};

const safeSetEx = async (key, ttl, value) => {
  if (!isConnected) return;
  try {
    return await rawClient.setEx(key, ttl, value);
  } catch {
    return;
  }
};

const safeDel = async (...keys) => {
  if (!isConnected) return;
  try {
    return await rawClient.del(...keys);
  } catch {
    return;
  }
};

const safeScanIterator = function* (...args) {
  if (!isConnected) return;
  try {
    yield* rawClient.scanIterator(...args);
  } catch {
    return;
  }
};

const redisClient = {
  get: safeGet,
  set: safeSet,
  setEx: safeSetEx,
  del: safeDel,
  scanIterator: safeScanIterator,
  get isReady() {
    return isConnected;
  },
};

export default redisClient;
