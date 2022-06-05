const Component = hoc(({ 
  value
}) => <div>{value}</div>);
export const ExportedComponent = hoc(({ 
  value
}) => <div>{value}</div>);
const Component2 = hoc(({ 
  value
}) => { 
  return <div>{value}</div>; 
});
const Component3 = hoc(hoc(hoc(({
  value
}) => {
  return <div>{value}</div>;
})));

const useCreateComponent = (arg) => {
  const Component = useCallback(({ children }) => <div>{children}</div>, [arg]);
  return Component;
};

const Components = {
  Component: hoc(({
    value
  }) => <div>{value}</div>),
  Component2: hoc(({
    value
  }) => {
    return <div>{value}</div>;
  }),
  Component3: hoc(hoc(hoc(({
    value
  }) => {
    return <div>{value}</div>;
  })))
};
