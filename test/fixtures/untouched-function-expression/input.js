const Component = hoc(function Component({ 
  value 
}) {
  return <div>{value}</div>;
})
const Component2 = hoc(async function({ 
  value 
}) {
  return <div>{value}</div>;
})

function Component3({ value }) { 
  return <div>{value}</div>;
}