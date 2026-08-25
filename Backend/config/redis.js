import redis from "redis";

const redisClient = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.connect();

export default redisClient;
