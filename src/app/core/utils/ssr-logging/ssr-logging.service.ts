import ecsFormat from '@elastic/ecs-pino-format';
import pino, { Logger, LoggerOptions } from 'pino';
import pinoPretty from 'pino-pretty';

/**
 * SSR Logging Service
 *
 * Provides structured logging capabilities for the SSR (Server-Side Rendering) environment
 * using Pino logger with support for ECS (Elastic Common Schema) formatting.
 *
 */

/**
 * Supported log levels, matches Pino's standard log levels.
 */
const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;

type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Supported log output formats.
 * - `json`: ECS-compliant JSON format for production/log aggregation
 * - `text`: Pretty-printed text format for development
 */
type LogFormat = 'json' | 'text';

interface LoggerConfig {
  // Log level threshold, messages below this level are not logged
  level?: LogLevel;
  // Output format for log messages
  format?: LogFormat;
  // Logger name, included in log output for identification
  name?: string;
}

/**
 * Retrieves the log level from the `LOGLEVEL` environment variable.
 * Falls back to 'error' if not set or invalid.
 *
 * @returns The configured log level or 'error' as default
 */
function getLogLevel(): LogLevel {
  const level = process.env.LOGLEVEL?.toLowerCase() as LogLevel;
  return LOG_LEVELS.includes(level) ? level : 'error';
}

/**
 * Retrieves the log format from the `LOGFORMAT` environment variable.
 * Falls back to 'json' if not set or invalid.
 *
 * @returns The configured log format or 'json' as default
 */
function getLogFormat(): LogFormat {
  const format = process.env.LOGFORMAT?.toLowerCase() as LogFormat;
  return format === 'text' ? 'text' : 'json';
}

/**
 * Builds PM2 process manager context if running under PM2.
 * Includes process ID and name for identifying log sources in clustered environments.
 *
 * @returns PM2 context object with id and name, or undefined if not running under PM2
 */
function getPM2Context(): Record<string, unknown> | undefined {
  if (process.env.pm_id && process.env.name) {
    return {
      pm2: {
        id: process.env.pm_id,
        name: process.env.name,
      },
    };
  }
  return;
}

/**
 * Creates Pino logger options based on the provided configuration.
 * Applies ECS formatting for JSON output and handles PM2 context injection.
 *
 * @param config - Logger configuration options
 * @returns Pino LoggerOptions configured for the specified format and level
 */
function createLoggerOptions(config: LoggerConfig): LoggerOptions {
  const level = config.level || getLogLevel();
  const format = config.format || getLogFormat();
  const pm2Context = getPM2Context();

  const baseOptions: LoggerOptions = {
    level,
    name: config.name,
    base: pm2Context ? { ...pm2Context } : undefined,
  };

  if (format === 'json') {
    // Disable Elastic APM agent integration to avoid unnecessary lookups when APM is not in use
    const ecsOptions = ecsFormat({ apmIntegration: false });

    // Uppercase the log level using ECS field name
    ecsOptions.formatters = {
      ...ecsOptions.formatters,
      level: (label: string) => ({ 'log.level': label.toUpperCase() }),
    };

    // Fix for webpack-bundled environment where bindings may be undefined
    const originalBindingsFormatter = ecsOptions.formatters?.bindings;
    if (originalBindingsFormatter) {
      ecsOptions.formatters.bindings = (bindings: Record<string, unknown> | undefined) =>
        originalBindingsFormatter(bindings || {});
    }

    return {
      ...baseOptions,
      ...ecsOptions,
    };
  } else {
    return {
      ...baseOptions,
      formatters: {
        level: (label: string) => ({ level: label.toUpperCase() }),
      },
    };
  }
}

/**
 * Creates the Pino destination stream for log output.
 * Outputs to stdout (fd 1) for Docker/PM2 compatibility.
 * Uses pino-pretty for text format with colorized, single-line output.
 *
 * @returns Pino destination stream configured for the current log format
 */
function createLoggerDestination(): pino.DestinationStream {
  const format = getLogFormat();

  if (format === 'text') {
    try {
      return pinoPretty({
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: true,
        errorLikeObjectKeys: [], // Disable special error formatting with new lines to keep single line
        destination: 1, // stdout
        sync: true, // synchronous for SSR compatibility
      });
    } catch {
      // If pino-pretty is not available, fall back to stdout
      return pino.destination(1);
    }
  }
  return pino.destination(1);
}

// Singleton logger instance, lazily initialized on first use.
let loggerInstance: Logger | undefined;

/**
 * Gets or creates the singleton Pino logger instance.
 * Creates the logger on first call and returns the cached instance on subsequent calls.
 *
 * @returns The singleton Pino Logger instance
 */
function getOrCreateLogger(): Logger {
  if (!loggerInstance) {
    const options = createLoggerOptions({});
    const destination = createLoggerDestination();
    loggerInstance = pino(options, destination);
  }
  return loggerInstance;
}

/**
 * Creates a child logger for the given context.
 * The context is included in log output under the `log.logger` field,
 * making it easy to filter logs by context.
 *
 * @param context - The context requesting the logger
 * @returns A Pino child logger instance with the context bound
 *
 * @example
 * ```typescript
 * const logger = getLogger('SSRErrorHandler');
 * logger.error({ ... }, 'HTTP ERROR');
 * // Output includes: { "log.logger": "SSRErrorHandler", "log.level": "ERROR", "message": "HTTP ERROR" }
 * ```
 */
export function getLogger(context: string): Logger {
  return getOrCreateLogger().child({ 'log.logger': context });
}
