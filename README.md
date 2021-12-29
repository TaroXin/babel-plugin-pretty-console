# babel-plugin-pretty-console

Use hooks for fast `console.log`

## Install

```bash
npm install babel-plugin-pretty-console -D
```

## Usage

```json
// in .babelrc
{
  "plugins": [
    ["pretty-console", {
      "token"："#", // <- as default
    }]
  ]
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
