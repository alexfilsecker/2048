export function Grid() {
  const divs = Array.from({ length: 16 }, (_, index) => (
    <div key={index} className="grid__div" />
  ));

  return <>{divs}</>;
}
