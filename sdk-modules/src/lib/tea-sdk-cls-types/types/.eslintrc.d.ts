declare const _extends: string[];
export { _extends as extends };
export declare const parser: string;
export declare namespace parserOptions {
  const project: string[];
  const tsconfigRootDir: string;
  const ecmaVersion: number;
  const sourceType: string;
  namespace ecmaFeatures {
    const jsx: boolean;
  }
}
export declare const settings: {
  react: {
    pragma: string;
    version: string;
  };
  'import/parsers': {
    '@typescript-eslint/parser': string[];
  };
  'import/resolver': {
    typescript: {
      alwaysTryTypes: boolean;
      project: string[];
    };
  };
};
export declare namespace env {
  const browser: boolean;
  const es6: boolean;
  const amd: boolean;
  const jquery: boolean;
  const jest: boolean;
}
export declare namespace globals {
  const seajs: boolean;
  const process: boolean;
}
export declare const plugins: string[];
export declare const rules: {
  'react/display-name': string;
  'react/prop-types': string;
  '@typescript-eslint/class-literal-property-style': string;
  'import/order': (
    | string
    | {
        groups: (string | string[])[];
        'newlines-between': string;
        alphabetize: {
          order: string;
          caseInsensitive: boolean;
        };
      }
  )[];
  'react-hooks/exhaustive-deps': (
    | string
    | {
        additionalHooks: string;
      }
  )[];
};
