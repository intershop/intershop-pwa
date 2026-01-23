import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { parse, stringify } from 'yaml';

function readDockerComposeFile(dir = '.') {
  const filePath = join(dir, 'docker-compose.yml');
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function writeDockerComposeFile(dir, content) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const filePath = join(dir, 'docker-compose.yml');
  try {
    writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function main(icm, ssrImage, nginxImage) {
  const content = readDockerComposeFile();
  const data = parse(content);

  delete data.services.pwa.build;
  delete data.services.nginx.build;

  data.services.pwa.image = ssrImage;
  data.services.pwa.environment.ICM_BASE_URL = icm;

  data.services.nginx.image = nginxImage;
  data.services.nginx.environment.ICM_BASE_URL = icm;
  data.services.nginx.environment.CACHE = 1;

  writeDockerComposeFile('./dist', stringify(data));
}

const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Usage: node demo-server-up.mjs <icm> <ssrimage> <nginximage>');
  process.exit(1);
}

const [icm, ssrImage, nginxImage] = args;
main(icm, ssrImage, nginxImage);
