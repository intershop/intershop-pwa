import { tsquery } from '@phenomnomnominal/tsquery';
import { ConditionalExpression, Expression, Node, Project, SourceFile, Statement, SyntaxKind } from 'ts-morph';
import * as ts from 'typescript';

/**
 * returns the new action name from an ActionClass or Action multiple export
 * @param identifier string that contains the action name
 */
export function standardizeIdentifier(identifier: string) {
  return identifier.includes('.')
    ? identifier.split('.')[1].replace(/^\w/, c => c.toLowerCase())
    : identifier.replace(/^\w/, c => c.toLowerCase());
}

/**
 * helper: checks whether the given expression text belongs to a map operator
 * @param identifier expression text
 */
export function isMap(identifier: string) {
  return identifier === 'map' || 'concatMap' || 'mergeMap' || 'switchMap' || 'mapTo';
}

/**
 * returns expression from conditional as array
 * @param conditional the conditional to extract expressions from
 */
export function getConditionalWhenExpressions(conditional: ConditionalExpression): Expression[] {
  return [conditional.getWhenTrue(), conditional.getWhenFalse()];
}

export function getReducerFunction(reducerFile: SourceFile) {
  return reducerFile.getFunctions().filter(func => func.getName().endsWith('Reducer'))[0];
}

export function getStateName(reducerFile: SourceFile): string {
  return reducerFile
    .getInterfaces()
    .find(i => i.getName().endsWith('State'))
    .getName();
}

export function checkReducerLoadingOnly(clauseBody: Statement<ts.Statement>): boolean {
  const ret = tsquery(
    clauseBody.compilerNode,
    'ReturnStatement > ObjectLiteralExpression'
  ) as ts.ObjectLiteralExpression[];
  return (
    ret &&
    ret.length === 1 &&
    ret[0].properties.length === 2 &&
    tsquery(ret[0], 'SpreadAssignment[expression.text=state]').length === 1 &&
    tsquery(ret[0], 'PropertyAssignment[name.text=loading][initializer.text=true]').length === 1
  );
}

export function checkReducerErrorHandler(clauseBody: Statement<ts.Statement>): boolean {
  const ret = tsquery(
    clauseBody.compilerNode,
    'ReturnStatement > ObjectLiteralExpression'
  ) as ts.ObjectLiteralExpression[];
  return (
    ret &&
    ret.length === 1 &&
    ret[0].properties.length === 3 &&
    tsquery(ret[0], 'SpreadAssignment[expression.text=state]').length === 1 &&
    tsquery(ret[0], 'PropertyAssignment[name.text=loading][initializer.text=false]').length === 1 &&
    (tsquery(ret[0], 'PropertyAssignment[name.text=error][initializer.text!=undefined]').length === 1 ||
      tsquery(ret[0], 'ShorthandPropertyAssignment[name.text=error]').length === 1)
  );
}

export function rewriteMapErrorToAction(project: Project) {
  const sourceFile = project.getSourceFileOrThrow('src/app/core/utils/operators.ts');

  const func = sourceFile.getFunctionOrThrow('mapErrorToAction');

  // change parameter
  func.getParameters()[0].setType('(props: { error: HttpError }) => T');

  func
    .getBody()
    .getDescendantsOfKind(SyntaxKind.NewExpression)
    .filter(node => node.getText().startsWith('new actionType'))
    .forEach(node => {
      node.replaceWithText('actionType({ error: HttpErrorMapper.fromError(err), ...extras })');
    });

  const testSourceFile = project.getSourceFileOrThrow('src/app/core/utils/operators.spec.ts');

  if (
    !testSourceFile.getImportDeclaration(imp =>
      imp.getModuleSpecifier().getText().includes('ish-core/utils/ngrx-creators')
    )
  ) {
    testSourceFile.addImportDeclaration({
      moduleSpecifier: 'ish-core/utils/ngrx-creators',
      namedImports: ['httpError'],
    });
  }

  testSourceFile.forEachDescendant(node => {
    if (Node.isClassDeclaration(node) && node.getName() === 'DummyFail') {
      node.replaceWithText("const dummyFail = createAction('dummy', httpError());");
    }
  });
  testSourceFile.forEachDescendant(node => {
    if (Node.isIdentifier(node) && node.getText() === 'DummyFail') {
      node.replaceWithText('dummyFail');
    }
  });
}

export function createPayloadAdapter(project: Project) {
  project.createSourceFile(
    'src/app/core/utils/ngrx-creators.ts',
    `
import { ActionCreator, On, on } from '@ngrx/store';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export function payload<P>() {
  return (args: P) => ({ payload: { ...args } });
}

export function httpError<P = {}>() {
  return (args: { error: HttpError } & P) => ({ payload: { ...args } });
}

export function setLoadingOn<S extends { loading: boolean }>(...actionCreators: ActionCreator[]): On<S> {
  const stateFnc = (state: S) => ({
    ...state,
    loading: true,
  });
  if (actionCreators.length === 1) {
    return on(actionCreators[0], stateFnc);
  } else {
    return on(actionCreators[0], ...actionCreators.splice(1), stateFnc);
  }
}

export function setErrorOn<S extends { loading: boolean; error: HttpError }>(
  ...actionCreators: ActionCreator[]
): On<S> {
  const stateFnc = (state: S, action: { payload: { error: HttpError }; type: string }) => ({
    ...state,
    error: action.payload.error,
    loading: false,
  });
  if (actionCreators.length === 1) {
    return on(actionCreators[0], stateFnc);
  } else {
    return on(actionCreators[0], ...actionCreators.splice(1), stateFnc);
  }
}
`,
    { overwrite: true }
  );
}
