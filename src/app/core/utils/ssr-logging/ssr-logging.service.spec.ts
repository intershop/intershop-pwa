describe('Ssr Logging Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset module cache to re-initialize the singleton logger with fresh environment variables
    // Each test must import the module after setting process.env to test different configurations
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getComponentLogger', () => {
    it('should return a logger instance with all log methods', async () => {
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('TestComponent');

      expect(logger).toBeTruthy();
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.fatal).toBe('function');
    });

    it('should return a child logger with component name bound', async () => {
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('MyComponent');

      expect(logger.bindings()).toEqual(expect.objectContaining({ 'log.logger': 'MyComponent' }));
    });

    it('should create distinct child loggers for different components', async () => {
      const { getLogger } = await import('./ssr-logging.service');
      const logger1 = getLogger('Component1');
      const logger2 = getLogger('Component2');

      expect(logger1.bindings()['log.logger']).toBe('Component1');
      expect(logger2.bindings()['log.logger']).toBe('Component2');
    });
  });

  describe('log level configuration', () => {
    it('should use error level by default when LOGLEVEL is not set', async () => {
      delete process.env.LOGLEVEL;
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(logger.level).toBe('error');
    });

    it.each(['debug', 'info', 'warn', 'error'])('should accept valid LOGLEVEL=%s', async level => {
      process.env.LOGLEVEL = level;
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(logger.level).toBe(level);
    });

    it('should fall back to error for invalid LOGLEVEL', async () => {
      process.env.LOGLEVEL = 'invalid';
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(logger.level).toBe('error');
    });

    it('should handle case-insensitive LOGLEVEL', async () => {
      process.env.LOGLEVEL = 'WARN';
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(logger.level).toBe('warn');
    });
  });

  describe('log format configuration', () => {
    it('should create logger if LOGFORMAT is not set', async () => {
      delete process.env.LOGFORMAT;
      process.env.LOGLEVEL = 'info';

      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(logger).toBeTruthy();
      expect(() => logger.info('test json message')).not.toThrow();
    });

    it('should create logger even if LOGFORMAT is invalid', async () => {
      process.env.LOGFORMAT = 'invalid';
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(logger).toBeTruthy();
    });

    it('should support text format when LOGFORMAT=text', async () => {
      process.env.LOGFORMAT = 'text';
      process.env.LOGLEVEL = 'info';

      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(() => logger.info('test message for pino-pretty')).not.toThrow();
    });
  });

  describe('PM2 context', () => {
    it('should not include PM2 bindings when not running under PM2', async () => {
      delete process.env.pm_id;
      delete process.env.name;
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      const bindings = logger.bindings();
      expect(bindings.pm2).toBeUndefined();
    });
  });

  describe('structured logging', () => {
    it('should handle simple messages', async () => {
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(() => logger.info('Test message')).not.toThrow();
    });

    it('should handle messages with metadata', async () => {
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(() => logger.info({ key: 'value' }, 'Test message with data')).not.toThrow();
    });

    it('should handle ECS-formatted HTTP request data', async () => {
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');

      expect(() => {
        logger.info(
          {
            trace: { id: 'test-trace-id' },
            http: {
              request: { method: 'GET' },
              response: { status_code: 200 },
            },
          },
          'HTTP request'
        );
      }).not.toThrow();
    });

    it('should handle error objects', async () => {
      const { getLogger } = await import('./ssr-logging.service');
      const logger = getLogger('Test');
      const error = new Error('Test error');

      expect(() => {
        logger.error({ error: { message: error.message, stack_trace: error.stack } }, 'Error occurred');
      }).not.toThrow();
    });
  });
});
