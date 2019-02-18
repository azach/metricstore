const metricStore = require('./metricStore');
const { COLORS, TIMES } = require('./constants');
const WORKER_INTERVAL = TIMES.TEN_MIN;
const WORKER_LOG_COLOR = COLORS.YELLOW;
const workers = {};

workers.clean = () => {
  console.log(WORKER_LOG_COLOR, `Starting clean operation at ${new Date()}`);
  Object.keys(metricStore).forEach(key => {
    const today = new Date();
    const oneHourAgo = new Date(today.getTime() - TIMES.ONE_HOUR);
    const newData = metricStore[key].filter(item => item.created >= oneHourAgo);
    metricStore[key] = newData;
  });
};

workers.init = () => {
  console.log(WORKER_LOG_COLOR, 'Background workers started');
  setInterval(workers.clean, WORKER_INTERVAL);
};

module.exports = workers;
