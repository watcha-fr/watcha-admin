module.exports = {
  parser: "babel-eslint",
  plugins: [
    "react",
    "flowtype",
    "babel"
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    }
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "max-len": ["error", {
            code: 90,
            ignoreComments: true,
        }],
        curly: ["error", "multi-line"],
        "prefer-const": ["error"],
        "comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "always-multiline",
        }],

        // loosen jsdoc requirements a little
        "require-jsdoc": ["error", {
            require: {
                FunctionDeclaration: false,
            }
        }],
        "valid-jsdoc": ["error", {
            requireParamDescription: false,
            requireReturn: false,
            requireReturnDescription: false,
        }],

        // rules we do not want from eslint-recommended
        "no-console": ["off"],
        "no-constant-condition": ["off"],
        "no-empty": ["error", { "allowEmptyCatch": true }],

        // rules we do not want from the google styleguide
        "object-curly-spacing": ["off"],
        "spaced-comment": ["off"],

        // in principle we prefer single quotes, but life is too short
        quotes: ["off"],

        // rules we'd ideally like to adhere to, but the current
        // code does not (in most cases because it's still ES5)
        // we set these to warnings, and assert that the number
        // of warnings doesn't exceed a given threshold
        "no-var": ["warn"],
        "brace-style": ["warn", "1tbs", {"allowSingleLine": true}],
        "prefer-rest-params": ["warn"],
        "prefer-spread": ["warn"],
        "one-var": ["warn"],
        "padded-blocks": ["warn"],
        "no-extend-native": ["warn"],
        "camelcase": ["warn"],
    // eslint's built in no-invalid-this rule breaks with class properties
    "no-invalid-this": "off",
    // so we replace it with a version that is class property aware
    "babel/no-invalid-this": "error",

    // We appear to follow this most of the time, so let's enforce it instead
    // of occasionally following it (or catching it in review)
    "keyword-spacing": "error",

    /** react **/
    // This just uses the react plugin to help eslint known when
    // variables have been used in JSX
    "react/jsx-uses-vars": "error",
    // Don't mark React as unused if we're using JSX
    "react/jsx-uses-react": "error",

    // bind or arrow function in props causes performance issues
    "react/jsx-no-bind": ["error", {
      "ignoreRefs": true,
    }],
    "react/jsx-key": ["error"],

    // Assert no spacing in JSX curly brackets
    // <Element prop={ consideredError} prop={notConsideredError} />
    //
    // https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/jsx-curly-spacing.md
    "react/jsx-curly-spacing": ["error", {"when": "never", "children": {"when": "always"}}],

    // Assert spacing before self-closing JSX tags, and no spacing before or
    // after the closing slash, and no spacing after the opening bracket of
    // the opening tag or closing tag.
    //
    // https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/jsx-tag-spacing.md
    "react/jsx-tag-spacing": ["error"],

    /** flowtype **/
    "flowtype/require-parameter-type": ["warn", {
      "excludeArrowFunctions": true,
    }],
    "flowtype/define-flow-type": "warn",
    "flowtype/require-return-type": ["warn",
    "always",
    {
      "annotateUndefined": "never",
      "excludeArrowFunctions": true,
    }
  ],
  "flowtype/space-after-type-colon": ["warn", "always"],
  "flowtype/space-before-type-colon": ["warn", "never"],

  /*
  * things that are errors in the js-sdk config that the current
  * code does not adhere to, turned down to warn
  */
  "max-len": ["warn", {
    // apparently people believe the length limit shouldn't apply
    // to JSX.
    ignorePattern: '^\\s*<',
    ignoreComments: true,
    code: 120,
  }],
  "valid-jsdoc": ["warn"],
  "new-cap": ["warn"],
  "key-spacing": ["warn"],
  "arrow-parens": ["warn"],
  "prefer-const": ["warn"],

  // crashes currently: https://github.com/eslint/eslint/issues/6274
  "generator-star-spacing": "off",
},
settings: {
  flowtype: {
    onlyFilesWithFlowAnnotation: true
  },
},
};
