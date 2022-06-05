const hoc = inner => {
  return inner;
};

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

const ComponentReturningMaybeJsx = hoc(() => {
  return true ? <div /> : null;
});
