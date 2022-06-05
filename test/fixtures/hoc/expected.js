const hoc = inner => {
  return inner;
};

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
