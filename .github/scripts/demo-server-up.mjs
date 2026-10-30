import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

// Converts the docker-compose.yml configuration into Azure App Service sidecar container definitions
// (sitecontainers spec file) and the app settings referenced by their environment variables.

const OUTPUT_DIR = './dist';

function readDockerComposeFile(dir = '.') {
  const filePath = join(dir, 'docker-compose.yml');
  try {
    return parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function writeJsonFile(fileName, content) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  try {
    writeFileSync(join(OUTPUT_DIR, fileName), JSON.stringify(content, undefined, 2), 'utf8');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

// sitecontainers environment variables only reference app settings by name, so every value is stored as a prefixed app setting
function toEnvironmentVariables(prefix, environment, appSettings) {
  return Object.entries(environment).map(([name, value]) => {
    const appSettingName = `${prefix}_${name}`;
    appSettings[appSettingName] = String(value);
    return { name, value: appSettingName };
  });
}

function main(icm, ssrImage, nginxImage) {
  const { pwa, nginx } = readDockerComposeFile().services;

  pwa.environment.ICM_BASE_URL = icm;
  pwa.environment.ALLOWED_HOSTS = '*.azurewebsites.net';

  nginx.environment.ICM_BASE_URL = icm;
  nginx.environment.CACHE = 1;
  // sidecar containers share the network namespace, service names are not resolvable
  nginx.environment.UPSTREAM_PWA = 'http://localhost:4200';

  const registryAuth = {
    authType: 'UserCredentials',
    userName: process.env.DOCKER_REGISTRY_USERNAME,
    passwordSecret: process.env.DOCKER_REGISTRY_PASSWORD,
  };

  const appSettings = {};
  const siteContainers = [
    {
      name: 'nginx',
      properties: {
        image: nginxImage,
        targetPort: '80',
        isMain: true,
        ...registryAuth,
        environmentVariables: toEnvironmentVariables('NGINX', nginx.environment, appSettings),
      },
    },
    {
      name: 'pwa',
      properties: {
        image: ssrImage,
        targetPort: '4200',
        isMain: false,
        ...registryAuth,
        environmentVariables: toEnvironmentVariables('PWA', pwa.environment, appSettings),
      },
    },
  ];

  writeJsonFile('appsettings.json', appSettings);
  writeJsonFile('sitecontainers.json', siteContainers);
}

const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Usage: node demo-server-up.mjs <icm> <ssrImage> <nginxImage>');
  process.exit(1);
}
if (!process.env.DOCKER_REGISTRY_USERNAME || !process.env.DOCKER_REGISTRY_PASSWORD) {
  console.error('DOCKER_REGISTRY_USERNAME and DOCKER_REGISTRY_PASSWORD environment variables must be set');
  process.exit(1);
}

const [icm, ssrImage, nginxImage] = args;
main(icm, ssrImage, nginxImage);
