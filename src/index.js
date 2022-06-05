const pathMod = require('path');

function doesReturnJSX(body) {
  if (!body) return false;
  if (body.type === 'JSXElement') {
    return true;
  }

  const block = body.body;
  if (block && block.length) {
    const lastBlock = block.slice(0).pop();

    if (lastBlock.type === 'ReturnStatement') {
      return lastBlock.argument !== null && lastBlock.argument.type === 'JSXElement';
    }
  }

  return false;
}

function convertToNamedFunction(path, nameNodeId, t) {
  const body = t.isBlock(path.node.body) ? path.node.body : t.blockStatement([t.returnStatement(path.node.body)]);
  path.replaceWith(t.functionExpression(nameNodeId, path.node.params, body));
}

function findCandidateNameForExpression(path) {
  let id;
  path.find(p => {
    if (p.isVariableDeclarator()) {
      id = p.node.id;
    } else if (p.isObjectProperty()) {
      id = p.node.key;
    } else if (p.isStatement()) {
      // we've hit a statement, we should stop crawling up
      return true;
    }

    // we've got an id! no need to continue
    if (id) return true;
    return false;
  });
  return id;
}

function shouldConvertToNamedFunctionForPath(path) {
  // if it is named no work is needed
  if (path.node.id?.name != null) return false;
  // if parent is a call expression, we have something like fnCall2(fnCall(() => { .. }))
  // move up, past the call expressions and identify the name
  
  const id = findCandidateNameForExpression(path);
  // let pathForId = path;
  // while (pathForId.parentPath.isCallExpression()) {
  //   pathForId = pathForId.parentPath;
  // }
  
  // let id;
  // if (pathForId.parentPath.isVariableDeclarator()) {
  //     id = pathForId.parentPath.node.id;
  // }

  return (id && doesReturnJSX(path.node.body));
}

function hasImplicitName(path, t) {
  return t.isVariableDeclarator(path.parentPath.node);
}
const syntaxJsx = require('@babel/plugin-syntax-jsx').default;

const handle = (path, babel) => {
  if (hasImplicitName(path, babel.types) || path.node.async) {
    return;
  }
  if (shouldConvertToNamedFunctionForPath(path)) {
    const id = findCandidateNameForExpression(path);
    if (id) {
      convertToNamedFunction(path, id, babel.types);
    }
  }
};

function transform(babel) {
  return {
    inherits: syntaxJsx,
    visitor: {
      FunctionExpression(path) {
        handle(path, babel)
      },
      ArrowFunctionExpression(path) {
        handle(path, babel)
      },
    },
  };
}

module.exports = transform;
