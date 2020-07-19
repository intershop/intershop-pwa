import { Project } from 'ts-morph';

import { ActionCreatorsActionsMorpher } from './migrate-action-creators.actions';
import { ActionCreatorsEffectMorpher } from './migrate-action-creators.effects';
import { ActionCreatorsReducerMorpher } from './migrate-action-creators.reducers';
import { createPayloadAdapter, rewriteMapErrorToAction } from './morph-helpers';

const project = new Project({ tsConfigFilePath: 'tsconfig.all.json' });

rewriteMapErrorToAction(project);

createPayloadAdapter(project);

const morpherPaths =
  process.argv.length > 2
    ? process.argv.splice(2).map(p => project.getDirectoryOrThrow(p))
    : project
        .getDirectories()
        .filter(d => !d.getDirectories().length)
        .filter(d => d.getPath().includes('/store/'));

const morphers = morpherPaths.map(dir => {
  const storeBaseNames = `${dir.getPath()}/${dir.getBaseName()}`;
  const actionsMorph = new ActionCreatorsActionsMorpher(project.getSourceFile(storeBaseNames + '.actions.ts'));
  return {
    storeName: dir.getPath(),
    actionsMorph,
    reducerMorph: new ActionCreatorsReducerMorpher(project.getSourceFile(storeBaseNames + '.reducer.ts'), actionsMorph),
    effectsMorphs: dir.getSourceFiles('*.effects.ts').map(eff => new ActionCreatorsEffectMorpher(eff)),
  };
});

console.log('updating all actions');

morphers.forEach(morpher => {
  morpher.actionsMorph.migrateActions();
  project.saveSync();
});

console.log('updating all reducers');

morphers.forEach(morpher => {
  morpher.reducerMorph.migrateReducer();
  project.saveSync();
});

console.log('updating all effects');

morphers.forEach(morpher => {
  morpher.effectsMorphs.forEach(m => {
    m.migrateEffects();
    project.saveSync();
  });
});
