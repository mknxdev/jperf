# <div align="center">jTester</div>

jTester is a lightweight JavaScript code tester utility for the browser and Node.js. It provides a flexible way to test arbitrary code and expose related performance informations.

## Installation

The main package's bundle uses the UMD format, meaning that it can be installed in multiple ways.  
An ESM-specific bundle is also available for use in modern projects.

### CDN (browser-only)

As this tool will often be used only temporary for testing purposes, the quickest way to add it to your codebase is by using a CDN-based script (which can be easily removed after testing).

```html
<script src="https://cdn.jsdelivr.net/npm/jtester-tool@1.0.0-beta.4/dist/jtester.min.js"></script>
```

### Package manager

However, you can also use a package manager to install jTester to your project.

```sh
npm i -D jtester-tool
```

```sh
yarn add -D jtester-tool
```

### Usage

When used as an IIFE (e.g. `<script>` tags), a `jTester` global function is exposed in the global context and can be used directly.

```js
jTester().test(/* ... */)
```

The package can also be imported using CommonJS or ESM syntaxes.

```js
import jtester from 'jtester-tool' // ESM
// or
const jtester = require('jtester-tool') // CJS

jtester().test(/* ... */)
```

Each call of the jTester function returns a new `JTester` instance on which the `.test` method can be called to test inner code.

```js
const testData = []
for (let i = 0; i < 10000; i++) testData.push(Math.random())

jTester()
  .test(() => {
    testData.sort()
  })
  .showAnalysis()
```

Multiple tests can be executed at once by chaining the `.test` method multiple times.

```js
const testData = []
for (let i = 0; i < 10000; i++) testData.push(Math.random())

jTester()
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

Note that only the inner code of the `.test`-provided function will be analysed, which means that you need to isolate the tested code in this function to get accurate running informations.

## Configuration

jTester behavior can be customized by passing a configuration object to the `jTester` function.

```js
jTester({
  // configuration options...
})
```

All available configuration options are described below.

### autorun

| type    | default |
| ------- | ------- |
| boolean | true    |

**Defines the global running strategy.**

By default, code tests will be executed on-the-fly right away after they are defined through the `.test` method.  
By setting this option to `false`, code tests will be simply stored and prepared for execution. In this case the execution must be triggered manually using the `.run` method.

### verbose

| type    | default |
| ------- | ------- |
| boolean | false   |

**Displays advanced informations about system and code tests.**

Set to `false` by default, it can be enabled to display advanced debug informations, like system and hardware-related infos.

> **:warning: Note:** Especially in browsers contexts, system or hardware-related informations are mostly based on properties that can be user-modified or are experimental features. They are only presented for testing and informational purposes.

## Public API

Here is the full list of the public properties and methods exposed by the jTester instance.

### Methods

Note: All methods that return a `JTester` object can be chained during calls.

### `.test(testFn: Function): JTester`

**Defines a performance test task.**

This method accepts a function as only argument which is internally executed and analysed.  
Each call to this method will automatically trigger the corresponding `testFn` function execution unless `autorun` configuration option is set to `false`.

### `.run(): JTester`

**Runs previously defined performance test tasks.**

This method manually triggers tasks' execution. It is not needed if `autorun` configuration option is set to `true`.
It is chainable with other instance methods.

### `.showAnalysis(): JTester`

**Logs testing results.**

Method used to log performance results of previous test tasks in the console.  
It is chainable with other instance methods.

### `.getAnalysis(format: string = 'js'): Object | string`

**Get analysis logs data.**

Use this method to retrieve analysis using various standard formats.  
It accepts one `format` argument which must be one of `js` (default), `json` or `xml`.

Here is the list of analysis properties returned by this method (this is applicable to all formats).

```js
{
  version: "x.x.x", // jTester version
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
