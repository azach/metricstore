const metricStore = require('./metricStore');

const addMetric = (newData, resolve, reject) => {
  console.log(`Adding metric: key: ${newData.key}, value: ${newData.value}`);

  // Check if the metric exists in store
  if (!metricStore.hasOwnProperty(newData.key)) {
    metricStore[newData.key] = [];
  }

  metricStore[newData.key].push({
    value: Math.round(newData.value),
    created: Date.now()
  });

  resolve();
};

module.exports = data => {
  return new Promise((resolve, reject) => {
    addMetric(data, resolve, reject);
  });
};
