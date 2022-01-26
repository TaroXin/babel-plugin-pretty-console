<p align="center">
  <img src="http://pic.taroxin.cn/pretty-console.png" width="200" alt="pretty console logo.">
  <h2 align="center">
    babel-plugin-pretty-console
  </h2>
  <p align="center">
    <font color="#999">Use hooks for fast <code>console.log</code></font>
  </p>
</p>

<a href="https://juejin.cn/post/7057172551746715661">中文文档</a>

## Install

```bash
npm install babel-plugin-pretty-console -D
```

## Usage

Configure `PrettyConsole` to your `.babelrc` file.

```json
{
  "plugins": ["pretty-console"]
}
```

## Examples

```Javascript
// #
function add(a, b) {
  return a + b;
}

// equals:

function add(a, b) {
  console.log('add:a', a)
  console.log('add:b', b)
  return a + b;
}
```

```Javascript
// #warn
let a = add(1, 2)

// equals:

let a = add(1, 2)
console.warn(a)
```

```Javascript
// #error TestFunction
let add = (a, b) => a + b

// equals:

let add = (a, b) => {
  console.error('TestFunction:a', a)
  console.error('TestFunction:b', b)
  return a + b
}
```

## Plugin options

- token `Set hook token used in comments`
- open `Set plugin enabled status`
- printFileName `Set print filename to console.log`

## Comments hook options

```Javascript
// token[consoleType] [hookName]

// ex:
// #warn TestFunction
```
