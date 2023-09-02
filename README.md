# <div align="center">jPerf</div>

jPerf is a flexible & lightweight JavaScript performance tester utility for the browser and Node.js. It provides a simple but powerful API to test code runtime performance in multiple ways.

## Summary

- [Installation](#installation)
- [Usage](#usage)
  - [Tests splitting](#tests-splitting)
  - [Alternative use: tick-based testing](#alternative-use-tick-based-testing)
- [Configuration](#configuration)
- [Public API](#public-api)
  - [Methods](#methods)
  - [Properties](#properties)
- [Limitations](#limitations)
- [Licensing](#licensing)

## Installation

This package is bundled using the UMD format, meaning that it can be installed in multiple ways.  
An ESM-specific bundle is also available for use in modern projects.

### CDN (browser-only)

As it will probably often be used only temporary for testing purposes, the quickest and easiest way to add jPerf to your codebase is by using a CDN-based script.

```html
<script src="https://cdn.jsdelivr.net/npm/jperf@latest/dist/jperf.min.js"></script>
```

### Package manager

However, you can also use a package manager to install it to your project.

```sh
npm i -D jperf
```

```sh
yarn add -D jperf
```

## Usage

When used as an IIFE (e.g. `<script>` tags), the script exposes a `jperf` function in the global context that can be used directly.

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

Each call to the `jperf` function returns a new `JPerf` instance on which the `.test` method can be called to test your code. You can also name your test to identify it easily (see [Public API](#public-api) for details).

```js
const data = []
for (let i = 0; i < 10000; i++) data.push(Math.random())

jperf()
  .test('sort test', () => {
    data.sort()
  })
  .log()
```

Multiple tests can be executed at once by chaining method calls.

```js
const data = []
for (let i = 0; i < 10000; i++) data.push(Math.random())

jperf()
  .test(() => {
    data.sort()
  })
  .test(() => {
    data.map((item) => Math.toFixed(3))
  })
  .test(() => {
    // ...
  })
  .log()
```

### Tests splitting

The callback param used in `.test` method provides a function argument which can be optionally used to "split" tests in multiple parts and provide more detailed performance informations.

```js
const data = []
for (let i = 0; i < 10000; i++) data.push(Math.random())

jperf()
  .test((_) => {
    data.sort()
    _()
    data.map((item) => Math.toFixed(3))
  })
  .log()
```

Calling the `_` function in the above example will automatically generate 2 "steps" for the test (one before and one after the function call). Each call will add a new step to the test to attach to it additional informations.

Steps-related runtime informations are always present in analysis extracts (.e.g `.getAnalysis`), but require to enable `verbose` mode in order to be displayed in the console.

### Alternative use: tick-based testing

Another way to test code is to use the "tick-based testing": instead of wrapping your tested code into callback functions, you can define key points around it using the `.tick` method.

```js
const data = []
for (let i = 0; i < 10000; i++) data.push(Math.random())

const j = jperf()
j.tick()
data.sort()
j.tick()
j.log()
```

This method accepts an optional `testName` argument (`string`) which is used to identify the following tested code.

It is also possible to use this method multiple times to run multiple tests.

```js
// ...
j.tick('sort test')
data.sort()
j.tick('map test')
data.map((item) => Math.toFixed(3))
j.tick()
// ...
```

_**Note:** Don't forget to add an end call to this method after your last test, otherwise the latter will not be completed correctly._

You can also "split" your tests with the tick-based approach. jPerf provides two public methods (`step` and `_`) that act the same way as the function argument provided by the `.test` method and are dedicated to work in conjunction with the `.tick` method.

```js
const data = []
for (let i = 0; i < 10000; i++) data.push(Math.random())

const j = jperf()
j.tick()
data.sort()
j._()
data.map((item) => Math.toFixed(3))
j.tick()
j.log()
```

See the [Public API](#public-api) section for more details on these methods.

## Configuration

jPerf behavior can be customized by passing to it a configuration object (described below). All configuration options are optional.

<!-- prettier-ignore -->
```js
jperf({ /* options */ })
```

### `autorun`

**Type** `boolean`

**Default** `true`

**_Defines the global running strategy._**

By default, test tasks are executed on-the-fly right away after they are defined.    
Setting this option to `false` will prevent test tasks to be executed directly. Their execution must be triggered manually using the `.run` method in that case.

### `verbose`

**Type** `boolean`

**Default** `false`

**_Displays advanced informations about test tasks._**

Can be enabled to display advanced runtime informations for test tasks.

### `output`

**Type** `string`

**Default** `console`

**_Output mode for analysis reports._**

Analysis data reports can be either output in the console with a "raw" style or in an HTML view for better readbility. Can be one of: `html`, `console`.

It is only available for browser contexts and should not be used in Node.js environments.

### `selector`

**Type** `string | HTMLElement`

**Default** `undefined`

**_Container element in which analysis reports must be rendered._**

Accepts a valid CSS selector or an HTML element in which analysis reports must be rendered.

It is required when `output` configuration option is set to `html`.

### `hardwareDetails`

**Type** `boolean`

**Default** `false`

**_Displays informations about script's underlying system._**

Parses and displays informations about operating system, CPU, RAM, etc.  
Note that especially in browsers' contexts, some system and hardware informations may not be available or not fully reliable (see [Limitations](#limitations) section for details).

### `anonymousTestName`

**Type** `string`

**Default** `(anonymous)`

**_Name used for anonymous tests._**

Defines the default name of anonymous test tasks.

### `anonymousTestIndex`

**Type** `number`

**Default** `0`

**_Starting index used for anonymous tests increment._**

Defines the starting index of the increment used for anonymous test tasks.

## Public API

Here is the full list of the public properties and methods exposed by the `JPerf` instance.

### Methods

Note: All methods that return a `JPerf` instance can be chained.

### `test`

**Signature** `.test(nameOrFn: string | Function, fn?: Function): JPerf`

**Params**

- `nameOrFn` (required): Defines the test name in case of `string` given, or the function-wrapped tested code otherwise.
- `fn` (optional): Optional by default, it is required to define the test task if the first argument is of type `string`.

**`nameOrFn`/`fn` function signature** `(step: Function) => void`

**`nameOrFn`/`fn` function params**

- `step`: Defines a key point at which the test will be splitted. Commonly named `_` for simplicity.

**_Defines a test task._**

Accepts a function to execute for analysis, and optionally a name for identifying the test case (`(anonymous)` is used if no name is provided).  
Each call to this method will automatically trigger the corresponding function execution unless `autorun` configuration option is set to `false`.

The callback function provides an optional function argument allowing to split the surrounding test.

### `tick`

**Signature** `.tick(testName?: string): void`

**Params**

- `testName` (optional): Defines the test name.

**_Defines a test task._**

Defines a key point that defines a new test task with the following code. It starts a new test task after eventually completing the previous one if any (after the first call).  
It accepts an optional `testName` argument for identifying the following test task (`(anonymous)` is used if no name is provided).

### `run`

**Signature** `.run(): JPerf`

**_Runs previously defined test tasks._**

Manually triggers test tasks' execution.  
It has no effect if `autorun` configuration option is set to `true`.

### `step`

**Signature** `.step(): void`

**_Splits the surrounding test task into steps ("tick"-based tests only)._**

Similar to the `.test`'s function argument, this method "splits" the surrounding test and generates advanced runtime informations.  
It is only usable for tests created using the `.tick` method.

### `_`

**Signature** `._(): void`

**_Alias of `step`._**

### `showAnalysis`

**Signature** `.showAnalysis(): JPerf`

**_Logs testing results._**

Method used to log performance results of previous test tasks in the console.

### `log`

**Signature** `.log(): JPerf`

**_Alias of `showAnalysis`._**

### `getAnalysis`

**Signature** `.getAnalysis(format: string = 'js'): Object | string`

**Params**

- `format` (optional): Defines output format for analysis data. Defaults to `js`.

**_Get analysis logs data._**

Use this method to retrieve analysis data using various formats.  
Accepts one `format` argument which must be one of: `js`, `json` or `xml`.

Here is the list of analysis properties returned by this method (applicable to all formats).

```js
{
  version: 'x.x.x', // package version
  global: {
    runtime: // total execution runtime (milliseconds)
  }
  tests: [
    {
      name: 'test', // test name
      runtime: 0, // test's execution runtime (milliseconds)
      steps: [ // test steps
        {
          index: 0, // step index
          runtime: 0, // step runtime
          percentage: 100 // step percentage (of total test runtime)
        }
      ]
    }
  ]
}
```

### Properties

/

## Limitations

Keep in mind that jPerf relies on native APIs (_Web API_ and _Node.js API_) that are not designed to change a lot over time. However, in some contexts, natives APIs can be manipulated by the user, more or less easily. It is more related to native properties than native functions.

Here is a list of some common limitations that can be encountered during usage.

- **[Browser-only]** System informations are mostly retrieved from the `[window.]navigator.userAgent` property. Note that some browsers allow the user to have access and change this value by any string, that can potentially break system informations parsing. This value can also be changed over time by software providers.  
See the [official documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent) for detailed informations.

- **[Browser-only]** Related to system inforamtions, the CPU core numbers exposed by jPerf relies on the native `[window.]navigator.hardwareConcurrency` property, that can reflect a different number of cores that the real one, due to some software limitations. In browser contexts, this number always reflects the **allocated** number of cores to run threads.  
Also note that in some browsers, this property is not natively supported.  
See the [official documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency) for detailed informations.

## Licensing

This package is released under the [MIT](https://opensource.org/license/mit/) license.
