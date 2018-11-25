module.exports = {
    preset: "jest-preset-angular",
    roots: ["src"],
    setupTestFrameworkScriptFile: "<rootDir>/src/test.ts",
    transformIgnorePatterns: [
      "node_modules/(?!(@ngrx|ngx-bootstrap|@angular/common/locales|lodash-es/.*))"
    ],
    moduleNameMapper: {
      "^ish-core(.*)$": "<rootDir>/src/app/core$1"
    }
}
