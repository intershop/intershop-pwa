import { Tree } from '@angular-devkit/schematics';
import { existsSync, readFileSync } from 'fs';
import { FileSystemHost, Project } from 'ts-morph';

export function createTsMorphProject(host: Tree) {
  return new Project({
    // tslint:disable-next-line: ish-no-object-literal-type-assertion
    fileSystem: {
      getCurrentDirectory: () => '',
      directoryExistsSync: p => host.exists(p) || existsSync(p),
      fileExistsSync: p => host.exists(p) || existsSync(p),
      readFileSync: (p, encoding) => (host.read(p) || readFileSync(p)).toString(encoding as BufferEncoding),
      readDirSync: dirPath => host.getDir(dirPath).subfiles.map(sf => sf as string),
    } as FileSystemHost,
  });
}
