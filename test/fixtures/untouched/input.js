export function Component({ value }) {
  return <div>{value}</div>;
}

export const Component2 = ({ value }) => {
  return <div>{value}</div>;
};

export const Component3 = ({ value }) => <div>{value}</div>;

function getReactElement(
  arg1,
  arg2,
  arg3
) {
  return <div />;
}

export const authenticate = nonJsxHof(async () => {
  await Promise.resolve();
});

const Components = {
  Component: hoc(({ value }) => <div>{value}</div>),
  Component2: hoc(({ value }) => { return <div>{value}</div>; }),
  Component3: hoc(hoc(hoc(({ value }) => { return <div>{value}</div>; }))),
};

const ComponentReturningMaybeJsx = hoc(() => {
  return true ? <div /> : null;
});
