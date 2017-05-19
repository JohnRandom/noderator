# Noderator 0.4.0

There is a [project wiki](https://github.com/JohnRandom/noderator/wiki) containing additional documentation and meeting notes.

## Installation

### Via NPM from GitHub

For the latest release:
```
npm install -g JohnRandom/noderator@latest
```

For a specific release:
```
npm install -g JohnRandom/noderator@0.1.0
```

For the development version or any other global branch:
For the latest release:
```
npm install -g JohnRandom/noderator#develop
```

To install a copy of Noderator you can actively work on, you first have to close the
Noderator repository:
```
git clone git@github.com:JohnRandom/noderator.git
```
and then, locally link the project:
```
cd noderator && npm link
```

## Usage
Noderator can currently create scaffolding for three parts of the architecture:

  1. Projects
  2. Modules
  3. Components

After installation, you can type `nr --help` to see a usage description:

```shell
$ nr --help
Usage: nr [options] <keyword> <type> <name>

Options:

  -h, --help           output usage information
  -c, --config [path]  The configuration file for noderator
  -p, --path [path]    Where to generate the new [type]
  -v, --verbose        Verbose mode
  -f, --force          Force the action, can overwrite existing files
```

  * `keyword` - currently only `generate`
  * `type` - one of: [ `project`, `module`, `component` ]
  * `name` - The name of the project, module or component to create

  Please refer to the sections below for documentation on how to use each `type`.

| Option    | Explanation                                                           |
| --------- | --------------------------------------------------------------------- |
| `config`  | A path to the configuration for noderator, see below for an example configuration. |
| `path`    | Provides a path were to copy the template directories and files. It overwrites the default locations. |
| `verbose` | More verbose output during code generation.                           |
| `force`   | If new code would overwrite existing one, noderator will throw an error and exit with status (1). This flag will prevent this behavior, issue a warning instead and overwrite the existing file or directory. |

### Configuration

Noderator comes with a basic configuration scaffold, that maps keywords and types to built-in functions. The user can overwrite this behavior and two ways:

  1. In the project root, include a `.nrconfig` file that provides the configuration
  2. Point to a configuration file, using the `-c` or `--config` cmdline argument

The structure of the built-in configuration can be found [here](./config.js) and looks like this:

```js
module.exports = {
  srcPath: null,
  generate: {
    project: [ require('./src/generators/project') ],
    module: [ require('./src/generators/module') ],
    component: [ require('./src/generators/component') ]
  }
}
```

Configurations are being merge shallowly, so you can overwrite `srcPath` by providing your own `.nrconfig` and just add a single key:

```js
const path = require('path')

module.exports = {
  srcPath: path.resolve(__dirname, 'src')
}
```

During path resolution, `srcPath` takes precedent over Noderator trying to resolve the project root itself.

### Keywords

#### Generate
Creates a new things by copying template directories to the appropriate places. Target locations can be overwritten by providing the optional `--path` command line argument. This will usually not replace existing files and directories, unless the optional `--force` argument was also provided.

#### Type
The type of the thing to generate. Currently supported are `projects`, `modules` and `components`.

##### Project
A `project` consists of a root directory containing dependencies and their configurations, the basic folder layout and some example code. After creating a new project, you can `npm install && npm run server` inside the project root and have node serve a simple welcome page. The project template contains the following elements:

`<projectRoot>`
  * assets
    * images
  * src
    * components/
      * Header/
        * `__tests__/`
        * Header.jsx
        * index.js
        * styles.css
    * layouts/
      * `__tests__/`
      * App.js
    * modules/
    * actions.js
    * index.html
    * main.js
    * manager.js
    * routes.js
    * settings.js
    * start.js
  * .babelrc
  * .gitignore
  * package.json
  * README.md
  * server.js
  * start.js
  * webpack.dev.config.js
  * webpack.production.config.js

##### Module
The `module` type creates new modules, by default at `src/modules`, which can be overwritten using the optional `--path` command line argument during module generation. Once a module was generated, it can be found at the given location and has the following structure:

`<moduleRoot>`
  * `__tests__/`
  * service.js
  * store.js

##### Component
The `component` type creates new components, by default at `src/components`, which can be overwritten using the optional `--path` command line argument during component generation. Once a component was generated, it can be found at the given location and has the following structure:

`<componentRoot>`
  * `__tests__/`
  * `<COMPONENT_NAME>`.globals.scss
  * `<COMPONENT_NAME>`.variables.scss
  * `<COMPONENT_NAME>`.styles.scss
  * `<COMPONENT_NAME>`.jsx
  * index.js

Alternatively, a component can be created for an existing module (let's say `Markers`), using the following notation during component generation:

```shell
nr generate component Markers/MarkerBox
```

which creates the `MarkerBox` component at `src/modules/Markers/components` and is a convenience shortcut for:

```shell
nr generate component --path src/modules/Markers/components MarkerBox
```

### configuration
The configuration needs to contain a `keyword` and `type` mapping to a function, provided a nested object:

```shell
$ nr generate project
```

will pass all command line arguments and its flags to all the functions found in the `generate.project` `Array`.

**Note:** Providing a custom configuration will currently overwrite and not merge the provided one.

#### Example

```javascript
module.exports = {
  generate: {
    project: [ require('./src/generators/project') ],
    module: [ require('./src/generators/module') ],
    component: [ require('./src/generators/component') ]
  }
}
```
