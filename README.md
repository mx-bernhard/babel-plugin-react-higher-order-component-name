# babel-plugin-react-higher-order-component-name

Infers name from outer variable declaration and changes arrow function to named function.


A simple transform to give functional React components that are supplied to a higher order function a name making debugging easier.

## Example

Transforms
```js
const higherOrderFunction = (WrappedComponent) => { 
  const wrapper = () => <div>{WrappedComponent}</div>;
  return wrapper.displayName = `higherOrderFunction(${WrappedComponent.displayName ?? WrappedComponent.name})`;
}

const Component = higherOrderFunction(() => <span>hello</span>);
```

to
```js
const higherOrderFunction = (WrappedComponent) => { 
  const wrapper = () => <div>{WrappedComponent}</div>;
  return wrapper.displayName = `higherOrderFunction(${WrappedComponent.displayName ?? WrappedComponent.name})`;
}

const Component = higherOrderFunction(function Component() { return <span>hello</span> });
```

Looking at the component tree in React dev tools, the two components will look like this:

```
higherOrderFunction(Component)
  Component
```
