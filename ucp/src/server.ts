import { createApp } from './app';
import { resolveUcpConfig } from './config';
import { getLogger } from './logger';

const logger = getLogger('UCP');

const config = resolveUcpConfig();
const app = createApp(config);

app.listen(config.port, () => {
  logger.info(
    {
      server: { port: config.port },
      url: { original: config.icmBaseUrl },
      labels: { channel: config.icmChannel },
    },
    'UCP service started'
  );
});
