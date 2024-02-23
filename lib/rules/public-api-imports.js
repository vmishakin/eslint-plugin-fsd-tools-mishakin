/**
 * @fileoverview FSD slice public api checker
 * @author dirtyman
 */
"use strict";

const { isPathRelative } = require('../helpers')
const micromatch = require('micromatch');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const PUBLIC_ERROR = 'PUBLIC_ERROR';
const TESTING_PUBLIC_ERROR = 'TESTING_PUBLIC_ERROR';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "FSD slice public api checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      [PUBLIC_ERROR]: 'Абсолютный импорт разрешен только из publicApi (index.ts)',
      [TESTING_PUBLIC_ERROR]: 'Тестовые данные необходимо импортировать из publicApi/testing.ts'
    }
  },

  create(context) {
    const { alias, testFilesPatterns } = context.options[0] ?? {}

    const availableLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
    }


    return {
      ImportDeclaration(node) {
        // app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split('/');

        const layer = segments[0];
        const slice = segments[1];
        if (!availableLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        // [entities, article, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node, messageId: PUBLIC_ERROR, fix: (fixer) => {
              return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`);
            }
          });
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const isCurrentFileTesting = micromatch.any(currentFilePath, testFilesPatterns)

          if (!isCurrentFileTesting) {
            context.report({ node, messageId: TESTING_PUBLIC_ERROR })
          }
        }

      }
    };
  },
};

