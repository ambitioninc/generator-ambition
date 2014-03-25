## Ambition Generator

Yeoman generator for Ambition.

## Installation

To install Yeoman:

```shell
npm install -g yo
```

To install the Ambition generator:

```shell
npm install -g generator-ambition
```

## Usage

Using the Ambition generator is simple:

```shell
yo ambition
```

To run tests:

```shell
npm test
```

To build your project (compiles js and/or css to the `build` directory):

```shell
npm run build
```

## Options

The Ambition generator will ask you several questions and generate app scaffolding based on your answers.

#### What would you like to call your project? (required)

The name of your project. Used to create folder and files names.

#### Does your project use CSS?

True to include Stylus and automatic css compilation. The result is saved to `build/project-name.css`.

#### Does your project use jQuery?

True to include jQuery in the project. The jQuery files are saved to `lib/jquery`.


#### Does your project used ECMAScript 6?

True to include the Traceur compiler and runtime. The runtime files are saved to `lib/traceur`.

#### Do you want to run tests on Browserstack?

True to automatically run your Jasmine tests on Browserstack. You must set appropriate `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` enviornment variables before testing. This task is ignored if both variables are not set.

