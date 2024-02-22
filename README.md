# eslint-plugin-fsd-tools-mishakin

eslint plugin for vmishakin/blog-with-fsd

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsd-tools-mishakin`:

```sh
npm install eslint-plugin-fsd-tools-mishakin --save-dev
```

## Usage

Add `fsd-tools-mishakin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "fsd-tools-mishakin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "fsd-tools-mishakin/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                                   | Description                          |
| :----------------------------------------------------- | :----------------------------------- |
| [layer-imports](docs/rules/layer-imports.md)           | fsd layer restriction                |
| [path-checker](docs/rules/path-checker.md)             | feature sliced relative path checker |
| [public-api-imports](docs/rules/public-api-imports.md) | FSD slice public api checker         |

<!-- end auto-generated rules list -->


