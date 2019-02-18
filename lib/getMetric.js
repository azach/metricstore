const metricStore = require('./metricStore');
const { COLORS, TIMES } = require('./constants');

const getMetric = (metric, resolve, reject) => {
  console.log(`Getting metric: ${metric}`);

  // Request metric is not in the data
  if (!metricStore.hasOwnProperty(metric)) {
    return reject({
      status: 400,
      message: `Metric ${metric} not found`
    });
  }

  // Return the sum of all metrics for this key over the past hour
  const today = new Date();
  const oneHourAgo = new Date(today.getTime() - TIMES.ONE_HOUR);
  const value = metricStore[metric]
    .filter(item => item.created >= oneHourAgo)
    .reduce((acc, cur) => acc + Math.round(cur.value), 0);

  resolve({ value });
};

module.exports = metric => {
  return new Promise((resolve, reject) => {
    getMetric(metric, resolve, reject);
  });
};
