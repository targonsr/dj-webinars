const strategyRealistic = require('./strategy.realistic');
const strategyCurrentQuick = require('./strategy.current.quick');
const strategyCurrentSlow = require('./strategy.current.slow');

/**
 * GENERATOR_MODE options:
 *   - 'REALISTIC': logs distributed over last 6 days (historical, with peaks)
 *   - 'CURRENT_QUICK': all logs have timestamps set to now (with small random jitter)
 *   - 'CURRENT_SLOW': logs are distributed over INGESTION_DURATION seconds, from now to now+duration
 */
const MODE = process.env.GENERATOR_MODE || 'REALISTIC';

function generateBatches() {
  if (MODE === 'REALISTIC') {
    return strategyRealistic();
  } else if (MODE === 'CURRENT_QUICK') {
    return strategyCurrentQuick();
  } else if (MODE === 'CURRENT_SLOW') {
    return strategyCurrentSlow();
  } else {
    throw new Error(`Invalid generator mode: ${MODE}`);
  }
}

module.exports = { generateBatches }; 