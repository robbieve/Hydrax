const cron = require('node-cron');

const eodHandlers = require('../handlers/eod');
const setup = require('../setup');
// schedule services
const scheduledJobs = [
  // bulk api eod daily
  cron.schedule('30 0 * * *', async () => {
    console.log('get daily ohlcvs at 00:30 every day');

    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    prevDate.setHours(0, 0, 0, 0);
    await eodHandlers.dailyOhlcvs('CC', prevDate);
  }),
  // live stocks data every i min
  cron.schedule('10 * * * * *', async () => {
    
    console.log('get live data every minute at 10 second');
    await eodHandlers.liveStockPrices('CC');
  }),
  // update symbol_codes table daily
  cron.schedule('0 0 * * *', async () => {
    console.log('populate symbol_codes db at 0:00 every day');

    setup.populateSymbol()
  }),
];

module.exports = {
  start: () => scheduledJobs.forEach(x => x.start()),
  stop: () => scheduledJobs.forEach(x => x.stop()),
};
