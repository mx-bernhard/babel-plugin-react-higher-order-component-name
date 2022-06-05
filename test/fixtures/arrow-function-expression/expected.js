const Component = hoc(function Component({
  value
}) {
  return <div>{value}</div>;
});
export const ExportedComponent = hoc(function ExportedComponent({
  value
}) {
  return <div>{value}</div>;
});
const Component2 = hoc(function Component2({
  value
}) {
  return <div>{value}</div>;
});
const Component3 = hoc(hoc(hoc(function Component3({
  value
}) {
  return <div>{value}</div>;
})));

const useCreateComponent = arg => {
  const Component = useCallback(function Component({
    children
  }) {
    return <div>{children}</div>;
  }, [arg]);
  return Component;
};

const Components = {
  Component: hoc(function Component({
    value
  }) {
    return <div>{value}</div>;
  }),
  Component2: hoc(function Component2({
    value
  }) {
    return <div>{value}</div>;
  }),
  Component3: hoc(hoc(hoc(function Component3({
    value
  }) {
    return <div>{value}</div>;
  })))
};
