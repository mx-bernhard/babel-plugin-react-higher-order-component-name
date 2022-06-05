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

function shouldSetDisplayNameForFuncExpr(path) {
  // Parent must be either 'AssignmentExpression' or 'VariableDeclarator' or 'CallExpression' with a parent of 'VariableDeclarator'
  if (path.node.id?.name != null) return false;
  let id;
  if (path.parentPath.node.type === 'AssignmentExpression' &&
      path.parentPath.node.left.type !== 'MemberExpression' && // skip static members
      path.parentPath.parentPath.node.type === 'ExpressionStatement' &&
      path.parentPath.parentPath.parentPath.node.type === 'Program') {
    id = path.parentPath.node.left;
  } else {
    let pathForId = path;
    // if parent is a call expression, we have something like (function () { .. })()
    // move up, past the call expression and run the rest of the checks as usual

    while (pathForId.parentPath.node.type === 'CallExpression') {
      pathForId = pathForId.parentPath;
    }

    if (pathForId.parentPath.node.type === 'VariableDeclarator') {
      if (pathForId.parentPath.parentPath.parentPath.node.type === 'ExportNamedDeclaration' ||
      pathForId.parentPath.parentPath.parentPath.node.type === 'Program') {
        id = pathForId.parentPath.node.id;
      }
    }
  }

  return (id?.name && doesReturnJSX(path.node.body));
}

// https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-react-display-name/src/index.js#L62-L77
// crawl up the ancestry looking for possible candidates for displayName inference
function findCandidateNameForExpression(path) {
  let id;
  path.find(p => {
    if (p.isAssignmentExpression()) {
      id = p.node.left;
    // } else if (path.isObjectProperty()) {
      // id = path.node.key;
    } else if (p.isVariableDeclarator()) {
      id = p.node.id;
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

function hasImplicitName(path, t) {
  return t.isVariableDeclarator(path.parentPath.node);
}
const syntaxJsx = require('@babel/plugin-syntax-jsx').default;

function transform(babel) {
  return {
    inherits: syntaxJsx,
    visitor: {
      FunctionDeclaration(path, state) {
        if (doesReturnJSX(path.node.body)
          && shouldSetDisplayNameForFuncExpr(path)
          && (path.parentPath.node.type === 'Program' || path.parentPath.node.type === 'ExportNamedDeclaration')) {
          convertToNamedFunction(path, path.node.id, babel.types);
        }
      },
      FunctionExpression(path, state) {
        if (shouldSetDisplayNameForFuncExpr(path)) {
          const id = findCandidateNameForExpression(path);
          if (id) {
            convertToNamedFunction(path, id, babel.types);
          }
        }
      },
      ArrowFunctionExpression(path, state) {
        if (hasImplicitName(path, babel.types) || path.node.async) {
          return;
        }
        if (shouldSetDisplayNameForFuncExpr(path)) {
          const id = findCandidateNameForExpression(path);
          if (id) {
            convertToNamedFunction(path, id, babel.types);
          }
        }
      },
    },
  };
}

module.exports = transform;
