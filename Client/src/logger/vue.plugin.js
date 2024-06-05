// eslint-disable-next-line
import { createLogger } from 'vue-logger-plugin';

// create logger with options
const logger = createLogger({
  enabled: true,
  level: 'debug',
  prefixFormat: ({ level, caller }) => (
    caller
      ? `[${level.toUpperCase()}] [${caller?.fileName}:${caller?.functionName}:${caller?.lineNumber}]`
      : `[${level.toUpperCase()}]`
  ),
});

export default logger;
