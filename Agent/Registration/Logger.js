/**
 * BetterLog
 * https://github.com/peterherrmann/BetterLog
 */
const Logger = (() => {
  const _logger = BetterLog.useSpreadsheet(CONSTS.SSID_FOR_LOGGER);
  _logger.DATE_TIME_LAYOUT = "yyyy-MM-dd kk:mm:ss.SS Z '[Agent]'";
  return _logger;
})();