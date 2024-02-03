/**
 * @fileoverview feature sliced relative path checker
 * @author dirtyman
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: '/Users/aboba/project/src/entities/Article/ui/Article/Article.tsx',
      code: "import {addCommentFormActions, addCommentFormReducer} from '../../model/slices/addComment'",
    },
  ],

  invalid: [
    {
      options: [
        {
          alias: '@'
        }
      ],
      filename: '/Users/aboba/project/src/entities/Article/ui/Article/Article.tsx',
      code: "import {addCommentFormActions, addCommentFormReducer} from '@/entities/Article/model/slices/addComment'",
      errors: [{ message: "в рамках одного слайса пути должны быть относительными" }],
    },
    {
      filename: '/Users/aboba/project/src/entities/Article/ui/Article/Article.tsx',
      code: "import {addCommentFormActions, addCommentFormReducer} from 'entities/Article/model/slices/addComment'",
      errors: [{ message: "в рамках одного слайса пути должны быть относительными" }],
    },
  ],
});
