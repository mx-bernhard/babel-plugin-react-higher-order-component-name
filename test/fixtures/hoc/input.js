const hoc = (inner) => {
  return inner;
};

const Component = hoc(({ value }) => <div>{value}</div>);
export const ExportedComponent = hoc(({ value }) => <div>{value}</div>);

const Component2 = hoc(({ value }) => { return <div>{value}</div>; });

const Component3 = hoc(hoc(hoc(({ value }) => { return <div>{value}</div>; })));
