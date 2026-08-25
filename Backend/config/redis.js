import redis from "redis";

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
  // password: "redis123",
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.connect();

export default redisClient;