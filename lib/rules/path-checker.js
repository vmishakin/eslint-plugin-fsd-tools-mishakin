"use strict";

const path = require('path')

const { isPathRelative } = require('../helpers')

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      shouldBeRelative: 'в рамках одного слайса пути должны быть относительными'
    }
  },

  create(context) {
    const alias = context.options[0] ? context.options[0].alias : '';
    return {
      ImportDeclaration(node) {
        // app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        const fromFilename = context.getFilename();
        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node, messageId: 'shouldBeRelative', fix: (fixer) => {
              const relativePath = createRelativePath(fromFilename, importTo)
              return fixer.replaceText(node.source, `'${relativePath}'`)
            }
          })
        }

      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split('/')
  const toLayer = toArray[0] // entities
  const toSlice = toArray[1] // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false
  }

  const fromNormalizedPath = path.toNamespacedPath(from);
  const isWindowsOS = fromNormalizedPath.includes('\\');
  const fromPath = fromNormalizedPath.split('src')[1];
  const fromArray = fromPath.split(isWindowsOS ? '\\' : '/'); // [ '', 'entities', 'Article' ]
  const fromLayer = fromArray[1]; // entities
  const fromSlice = fromArray[2]; // Article

  if (!fromLayer || !fromSlice || !layers[toLayer]) {
    return false
  }

  return fromSlice === toSlice && toLayer === fromLayer
}

function createRelativePath(currFileAbsolutePath, importPath) {
  const normalizedPath = path.toNamespacedPath(currFileAbsolutePath);
  const currFilePath = normalizedPath.split('src')[1];
  const currFileDirName = path.dirname(currFilePath);

  let relativePath = path.relative(currFileDirName, path.sep + importPath);

  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath
}