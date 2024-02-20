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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "FSD slice public api checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
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
      absoluteImportForbidden: 'Абсолютный импорт разрешен только из publicApi (index.ts)',
      testingDataImport: 'Тестовые данные необходимо импортировать из publicApi/testing.ts'
    }
  },

  create(context) {
    const alias = context.options[0] ? context.options[0].alias : '';
    const testFilesPatterns = context.options[0] ? context.options[0].testFilesPatterns : {};

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
        if (!availableLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        // [entities, article, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({ node, messageId: 'absoluteImportForbidden' });
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const isCurrentFileTesting = micromatch.any(currentFilePath, testFilesPatterns)

          if (!isCurrentFileTesting) {
            context.report({ node, messageId: 'testingDataImport' })
          }
        }

      }
    };
  },
};
