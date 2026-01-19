import { ecsFormat } from '@elastic/ecs-pino-format';
import pino, { Logger } from 'pino';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = SSR ? require('../../../../package.json') : { version: 'unknown' };

// Log levels in order of severity (lower index = more verbose)
export type LogLevel = 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  info: 0,
  warn: 1,
  error: 2,
};

/**
 * Parse the LOGLEVEL environment variable.
 * Valid values: 'info', 'warn', 'error' (case-insensitive)
 * Default: 'warn'
 */
function parseLogLevel(): LogLevel {
  const envLevel = SSR ? process.env.LOGLEVEL?.toLowerCase() : undefined;
  if (envLevel === 'info' || envLevel === 'warn' || envLevel === 'error') {
    return envLevel;
  }
  return 'warn'; // Default log level
}

// Environment configuration - only access process in SSR context
export const loggingEnabled = SSR && /on|1|true|yes/.test(process.env.LOGGING?.toLowerCase() || '');

export const useJsonFormat = SSR && /on|1|true|yes/.test(process.env.LOGFORMAT?.toLowerCase() || '');

/**
 * The configured log level threshold. Only messages at this level or higher severity will be logged.
 * Configured via LOGLEVEL environment variable. Default: 'warn'
 */
const configuredLogLevel: LogLevel = parseLogLevel();

/**
 * Check if a message at the given level should be logged based on the configured log level.
 *
 * @param level - The level of the message to check
 * @returns true if the message should be logged, false otherwise
 */
export function shouldLog(level: LogLevel): boolean {
  if (!loggingEnabled) {
    return false;
  }
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[configuredLogLevel];
}

const SERVICE_NAME = SSR ? process.env.name || 'intershop-pwa-ssr' : 'intershop-pwa-ssr';

const SERVICE_VERSION = pkg.version || 'unknown';

const SERVICE_NODE_NAME = SSR ? process.env.pm_id?.toString() || process.env.NODE_APP_INSTANCE?.toString() || '0' : '0';

// Logger types
export type AppLogger = Logger | ConsoleLogger | NoOpLogger;

type ConsoleLogger = {
  info(first: unknown, ...rest: unknown[]): void;
  warn(first: unknown, ...rest: unknown[]): void;
  error(first: unknown, ...rest: unknown[]): void;
  debug(first: unknown, ...rest: unknown[]): void;
  trace(first: unknown, ...rest: unknown[]): void;
  fatal(first: unknown, ...rest: unknown[]): void;
  child(bindings?: unknown): AppLogger;
};

type NoOpLogger = {
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  debug(...args: unknown[]): void;
  trace(...args: unknown[]): void;
  fatal(...args: unknown[]): void;
  child(bindings?: unknown): AppLogger;
};

// ECS format logger options with configured log level
const loggerOptions: pino.LoggerOptions = {
  ...ecsFormat({
    serviceName: SERVICE_NAME,
    serviceVersion: SERVICE_VERSION,
    serviceNodeName: SERVICE_NODE_NAME,
    convertReqRes: true, // Enable HTTP request/response conversion
    convertErr: true, // Enable error conversion
    apmIntegration: false, // Disable Elastic APM (Application Performance Monitoring) agent integration
  }),
  level: configuredLogLevel, // Set pino's log level from configuration
};

// Wrapper to convert structured logging to plain text when using console
// Respects the configured log level for non-JSON mode
const createConsoleWrapper = (consoleLogger: typeof console): ConsoleLogger => {
  const wrapper: Partial<ConsoleLogger> = {};

  const createMethod =
    (method: 'info' | 'warn' | 'error' | 'debug' | 'trace') =>
    (first: unknown, ...rest: unknown[]) => {
      // Check if this log level should be logged based on configured threshold
      // Map debug/trace to info for level checking (they are below info)
      const levelToCheck: LogLevel = method === 'debug' || method === 'trace' ? 'info' : (method as LogLevel);
      if (!shouldLog(levelToCheck)) {
        return;
      }
      if (typeof first === 'object' && first !== undefined && rest.length > 0) {
        consoleLogger[method](...rest);
      } else {
        consoleLogger[method](first, ...rest);
      }
    };

  wrapper.info = createMethod('info');
  wrapper.warn = createMethod('warn');
  wrapper.error = createMethod('error');
  wrapper.debug = createMethod('debug');
  wrapper.trace = createMethod('trace');
  wrapper.fatal = createMethod('error'); // Console doesn't have fatal
  wrapper.child = () => wrapper as ConsoleLogger;

  return wrapper as ConsoleLogger;
};

// No-op logger when LOGGING=false
const noop = (): void => undefined;

const noopLogger: NoOpLogger = {
  info: noop,
  warn: noop,
  error: noop,
  debug: noop,
  trace: noop,
  fatal: noop,
  child: () => noopLogger,
};

let cachedLogger: AppLogger | undefined;

/**
 * Get or create the shared logger instance.
 * Supports pino (JSON/ECS mode), console wrapper (plain text), or no-op (logging disabled).
 *
 * @param source - Optional source identifier for child logger (e.g., 'server.ts')
 * @returns The logger instance, optionally as a child logger with log.logger binding
 */
export function getLogger(source?: string): AppLogger {
  if (!cachedLogger) {
    if (loggingEnabled) {
      if (useJsonFormat) {
        try {
          cachedLogger = pino(loggerOptions);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to initialize pino logger, falling back to console:', err);
          cachedLogger = createConsoleWrapper(console);
        }
      } else {
        cachedLogger = createConsoleWrapper(console);
      }
    } else {
      cachedLogger = noopLogger;
    }
  }

  // Return child logger with source binding if provided
  if (source && cachedLogger.child) {
    return cachedLogger.child({ log: { logger: source } });
  }

  return cachedLogger;
}

/**
 * Check if the logger is a pino Logger instance (for pinoHttp compatibility)
 */
export function isPinoLogger(value: unknown): value is Logger {
  return (
    !!value &&
    typeof (value as Logger).info === 'function' &&
    typeof (value as Logger).child === 'function' &&
    !!(value as Logger).levels
  );
}

/**
 * ECS-compliant logging
 *
 * @param level - Log level ('info' | 'warn' | 'error')
 * @param message - Log message
 * @param source - Source (identify the module/component)
 * @param extra - Additional ECS-compliant fields to include in the log
 */
export function logECS(
  level: 'info' | 'warn' | 'error',
  message: string,
  source: string,
  extra?: Record<string, unknown>
): void {
  if (!shouldLog(level)) {
    return;
  }

  const logger = getLogger();
  if (useJsonFormat) {
    logger[level]({ log: { logger: source }, ...extra }, message);
  } else {
    // eslint-disable-next-line no-console
    console[level](`${message}`);
  }
}
