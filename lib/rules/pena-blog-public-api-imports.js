/**
 * @fileoverview FSD slice public api checker
 * @author dirtyman
 */
"use strict";

const { isPathRelative } = require('../helpers')

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
          }
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      absoluteImportForbidden: 'Абсолютный импорт разрешен только из publicApi (index.ts)'
    }
  },

  create(context) {
    const alias = context.options[0] ? context.options[0].alias : '';

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

        if (isImportNotFromPublicApi) {
          context.report({ node, messageId: 'absoluteImportForbidden' });
        }

      }
    };
  },
};
