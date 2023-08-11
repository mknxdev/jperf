# <div align="center">jPerf</div>

jPerf is a modern & lightweight JavaScript code tester utility for the browser and Node.js. It provides a flexible way to perf test arbitrary code and exposes related performance informations.

## Summary

- [Installation](#installation)
- [Usage](#usage)
  - [Alternative use: tick-based testing](#alternative-use-tick-based-testing)
- [Configuration](#configuration)
- [Public API](#public-api)
  - [Methods](#methods)
  - [Properties](#properties)
- [Licensing](#licensing)

## Installation

The main package's bundle uses the UMD format, meaning that it can be installed in multiple ways.  
An ESM-specific bundle is also available for use in modern projects.

### CDN (browser-only)

As this tool will often be used only temporary for testing purposes, the quickest way to add it to your codebase is by using a CDN-based script (which can be easily removed after testing).

```html
<script src="https://cdn.jsdelivr.net/npm/jperf@latest/dist/jperf.min.js"></script>
```

### Package manager

However, you can also use a package manager to install JPerf to your project.

```sh
npm i -D jperf
```

```sh
yarn add -D jperf
```

## Usage

When used as an IIFE (e.g. `<script>` tags), a `jperf` function is exposed in the global context and can be used directly.

```js
jperf().test(/* ... */)
```

The package can also be imported using CommonJS or ESM syntaxes.

```js
import jperf from 'jperf' // ESM
// or
const jperf = require('jperf') // CJS

jperf().test(/* ... */)
```

Each call to the `jperf` function returns a new `JPerf` instance on which the `.test` method can be called to test code. You can also name your test to identify it easily (see [Public API](#public-api) for details).

```js
const testData = []
for (let i = 0; i < 10000; i++) testData.push(Math.random())

jperf()
  .test('sort test', () => {
    testData.sort()
  })
  .showAnalysis()
```

Multiple tests can be executed at once by chaining `.test` method calls.

```js
const testData = []
for (let i = 0; i < 10000; i++) testData.push(Math.random())

jperf()
  .test(() => {
    testData.sort()
  })
  .test(() => {
    testData.map((item) => Math.toFixed(3))
  })
  .test(() => {
    // ...
  })
  .showAnalysis()
```

### Alternative use: tick-based testing

An other way to test code is to use the jPerf's "tick-based testing": instead of wrapping your tested code into callback functions, you can define key points around your code with the `.tick` method.

```js
const testData = []
for (let i = 0; i < 10000; i++) testData.push(Math.random())

const jpf = jperf()
jpf.tick()
testData.sort()
jpf.tick()
jpf.showAnalysis()
```

This method accepts an optional `testName` argument (`string`) which is used to identify the corresponding test (only name first call).

It is also possible to use this method multiple times to run multiple tests.

```js
// ...
jpf.tick('sort test')
testData.sort()
jpf.tick('map test')
testData.map((item) => Math.toFixed(3))
jpf.tick()
// ...
```

## Configuration

JPerf can be customized by passing to it a configuration object (described below). All configuration options are optional.

<!-- prettier-ignore -->
```js
jperf({ /* options */ })
```

### `autorun`

| type    | default |
| ------- | ------- |
| boolean | `true`  |

**_Defines the global running strategy._**

By default, code tests will be executed on-the-fly right away after they are defined through the `.test` method.  
Setting this option to `false` will prevent code tests to be executed directly. The execution must be triggered manually using the `.run` method in that case.

### `verbose`

| type    | default |
| ------- | ------- |
| boolean | `false` |

**_Displays advanced informations about system and code tests._**

Set to `false` by default, it can be enabled to display advanced debug informations, like system and hardware-related infos.

### `anonymousTestName`

| type   | default     |
| ------ | ----------- |
| string | `anonymous` |

**_Name used for anonymous tests._**

Allows to customize the name of code tests run without a name.

### `anonymousTestIndex`

| type   | default     |
| ------ | ----------- |
| string | `0`         |

**_Starting index used for anonymous tests increment._**

Allows to customize the starting index of the increment used for anonymous code tests.

## Public API

Here is the full list of the public properties and methods exposed by the JPerf instance.

### Methods

Note: All methods that return a `JPerf` instance can be chained.

### `.test`

**Signature** `.test(nameOrFn: string | Function, fn?: Function): JPerf`

**Params**

- `nameOrFn` (required): Defines the test name in case of `string` given, or the code test otherwise (`function`).
- `fn` (optional): Required to define the code test if first argument is of type `string`.

**_Defines a test task._**

Accepts a function to execute for analysis, and optionally a name for identifying the test case (`anonymous` is used if no name is provided).  
Each call to this method will automatically trigger the corresponding function execution unless `autorun` configuration option is set to `false`.

### `.tick`

**Signature** `.tick(testName?: string): void`

**Params**

- `testName` (required): Defines the test name.

**_Defines a test task._**

Defines a key point to for a new code test (e.g. "Alternative use"), and optionally accepts a name for identifying the test case (`anonymous` is used if no name is provided).  
This method is called indifferently for starting or ending code test: each new call to automatically stops analysis for previous running test.

### `.run`

**Signature** `.run(): JPerf`

**_Runs previously defined test tasks._**

Manually triggers test tasks' execution.  
It has no effect if `autorun` configuration option is set to `true`.

### `.showAnalysis`

**Signature** `.showAnalysis(): JPerf`

**_Logs testing results._**

Method used to log performance results of previous test tasks in the console.

### `.log`

**Signature** `.log(): JPerf`

**_Alias of `.showAnalysis`._**

### `.getAnalysis`

**Signature** `.getAnalysis(format: string = 'js'): Object | string`

**Params**

- `format` (optional): Defines output format for analysis data. Defaults to `js`.

**_Get analysis logs data._**

Use this method to retrieve analysis data using various formats.  
Accepts one `format` argument which must be one of: `js`, `json` or `xml`.

Here is the list of analysis properties returned by this method (applicable to all formats).

```js
{
  version: "x.x.x", // JPerf version
  tests: [
    {
      name: 'test', // test name
      runtime: 0, // test's execution runtime (milliseconds)
    }
  ]
}
```

### Properties

/

## Licensing

This package is released under the [MIT](https://opensource.org/license/mit/) license.
