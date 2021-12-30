<div style="display:flex;justify-content:center;align-items:center;flex-flow:column nowrap;border-bottom:1px solid #DEDEDE;padding-bottom:35px">
  <img src="./icon.png" style="width: 200px; margin: 0 auto;">
  <div style="font-size:32px;font-weight:bold;margin-top:35px;">
    babel-plugin-pretty-console
  </div>
  <div style="color:#999;font-size:16px;font-weight:bold;">
    Use hooks for fast <code>console.log</code>
  </div>
</div>

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
