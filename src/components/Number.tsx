type NumberProps = {
  value: number;
  row: number;
  col: number;
};

export function Number({ value, row, col }: NumberProps) {
  return (
    <div className={`number row-${row} col-${col} nmbr-${value}`}>{value}</div>
  );
}
