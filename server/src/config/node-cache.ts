import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 60 * 60 * 3, // 3 hours
  checkperiod: 60 * 60 * 1, // 1 hour
});

export { cache };