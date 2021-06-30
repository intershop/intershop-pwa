export function getDeployURLFromEnv(): string {
  const envDeployUrl = process.env.DEPLOY_URL || '/';

  return `${envDeployUrl}${envDeployUrl.endsWith('/') ? '' : '/'}`;
}

export function setDeployUrlInFile(deployUrl: string, path: string, input: string): string {
  if (input) {
    if (path.startsWith('runtime') && path.endsWith('.js')) {
      return input.replace(/DEPLOY_URL_PLACEHOLDER/g, deployUrl);
    }

    let newInput = input;

    const cssRegex = /url\((?!http)\/?(assets.*?|[a-zA-Z].*?woff2?)\)/g;
    if (cssRegex.test(newInput)) {
      newInput = newInput.replace(cssRegex, (...args) => `url(${deployUrl}${args[1]})`);
    }

    const assetsRegex = /"\/?(assets[^"]*\.(\w{2,5}|webmanifest)|[a-z0-9]+\.css)"/g;
    if (assetsRegex.test(newInput)) {
      newInput = newInput.replace(assetsRegex, (...args) => `"${deployUrl}${args[1]}"`);
    }

    const javascriptRegex = /"(DEPLOY_URL_PLACEHOLDER|\/)?((runtime|vendor|main|polyfills|styles)[^"]*\.(js|css))"/g;
    if (javascriptRegex.test(newInput)) {
      newInput = newInput.replace(javascriptRegex, (...args) => `"${deployUrl}${args[2]}"`);
    }

    return newInput;
  }
  return input;
}
