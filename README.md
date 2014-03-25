## Ambition Generator

Yeoman generator for Ambition.

## Table of Contents
1. [Installation](#installation)
1. [Usage](#usage)
1. [Options](#options)
1. [Structure](#structure)

## <a name="installation">Installation</a>

To install Yeoman:

```shell
npm install -g yo
```

To install the Ambition generator:

```shell
npm install -g generator-ambition
```

## <a name="usage">Usage</a>

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

## <a name="options">Options</a>

The Ambition generator will ask you several questions and generate app scaffolding based on your answers.

#### What would you like to call your project? (required)

The name of your project. Used to create folder and file names.

#### Does your project use CSS?

True to include Stylus for automatic compilation. Save your `.styl` files to the `style` directory. The resulting css is saved to `build/project-name.css`.

#### Does your project use jQuery?

True to include jQuery in the project. The jQuery files are saved to `lib/jquery`.


#### Does your project used ECMAScript 6?

True to include the Traceur compiler and runtime. The runtime files are saved to `lib/traceur`.

#### Do you want to run tests on Browserstack?

True to automatically run your Jasmine tests on Browserstack. You must set appropriate `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` enviornment variables before testing. This task is ignored if both variables are not set.

## <a name="structure">Structure</a>

Save `.styl` files to the `style` directory. Save `.js` files to appropriate modules in the `src` directory. Save tests in each module's `tests` directory.

Example file tree (with included CSS and jQuery):

```shell
.
├── bower.json
├── build
│   ├── my-app.js
│   └── my-app.css
├── gruntfile.js
├── lib
│   └── jquery
│       ├── MIT-LICENSE.txt
│       ├── bower.json
│       ├── jquery.js
│       ├── jquery.min.js
│       └── jquery.min.map
├── package.json
├── src
│   └── my-app
│       ├── app.js
│       └── tests
│           └── app_tests.js
└── style
    └── variables
        └── all.styl
```

