const chalk = require('chalk');
const fs = require('fs');
const { generateBatches } = require('./strategies');
const { sendToLoki } = require('./sender');
const { getLabels } = require('./configuration');

function humanFileSize(bytes) {
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = ['KB', 'MB', 'GB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}

module.exports = async function run() {
  const outputDir = 'output';
  const { batches, meta } = generateBatches();
  const allLogs = batches.flatMap(batch => batch.logs);
  const fileName = `${outputDir}/${Date.now()}-${meta.strategy}.log`;
  fs.writeFileSync(fileName, allLogs.map(l => l[1]).join('\n'));

  let batchIndex = 0;
  let successCount = 0;
  let failCount = 0;
  console.log(chalk.greenBright(`Strategy: ${meta.strategy}`));
  console.log(chalk.greenBright(`Total batches: ${batches.length}, total logs: ${allLogs.length}`));

  for (const batch of batches) {
    batchIndex++;
    const batchLabels = batch.meta && batch.meta.labels ? batch.meta.labels : getLabels();
    console.log(chalk.cyanBright(`Sending batch ${batchIndex}/${batches.length} (${batch.logs.length} logs) labels: ${JSON.stringify(batchLabels)}`));
    try {
      await sendToLoki(batch.logs, batchLabels);
      successCount++;
    } catch (e) {
      failCount++;
      console.error(chalk.redBright(`Batch ${batchIndex} failed: ${e.message}`));
    }
    if (batch.delay) {
      await new Promise(resolve => setTimeout(resolve, batch.delay));
    }
  }
  const stats = fs.statSync(fileName);
  const sizeStr = humanFileSize(stats.size);
  console.log(chalk.greenBright('Finished sending all logs'));
  console.log(chalk.greenBright(`Strategy: ${meta.strategy}`));
  console.log(chalk.greenBright(`Batches: ${batches.length} (succeeded: ${successCount}, failed: ${failCount})`));
  console.log(chalk.greenBright(`Logs: ${allLogs.length}`));
  console.log(chalk.greenBright(`Log file: ${fileName} (${sizeStr})`));
}
