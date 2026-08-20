/**
 * Minimal structured (JSON) logger with a pino-like `(fields, message)` API,
 * so the service has no logging dependency of its own.
 */
type Level = 'debug' | 'error' | 'info' | 'warn';

type Fields = Record<string, unknown>;

function emit(level: Level, context: string, first: Fields | string, message?: string): void {
  const base = { time: new Date().toISOString(), level, logger: context };
  const entry =
    typeof first === 'string' ? { ...base, message: first } : { ...base, ...first, ...(message ? { message } : {}) };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    process.stderr.write(`${line}\n`);
  } else {
    process.stdout.write(`${line}\n`);
  }
}

export interface Logger {
  debug(fields: Fields | string, message?: string): void;
  info(fields: Fields | string, message?: string): void;
  warn(fields: Fields | string, message?: string): void;
  error(fields: Fields | string, message?: string): void;
}

export function getLogger(context: string): Logger {
  return {
    debug: (fields, message) => emit('debug', context, fields, message),
    info: (fields, message) => emit('info', context, fields, message),
    warn: (fields, message) => emit('warn', context, fields, message),
    error: (fields, message) => emit('error', context, fields, message),
  };
}
