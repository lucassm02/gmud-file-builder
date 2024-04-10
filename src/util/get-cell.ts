type Table = GoogleAppsScript.Document.Table;
type TableCell = GoogleAppsScript.Document.TableCell;
type TableRow = GoogleAppsScript.Document.TableRow;

type ArgOne = Table[] | Table | TableCell | TableRow;

function getCellByPath(tables: ArgOne, path: Path) {
  let value;
  if (Array.isArray(tables)) {
    value = <Table>tables[path.index];
  } else {
    value = <TableCell>tables.getChild(path.index);
  }

  if (path.col !== undefined && path.row !== undefined) {
    value = value.asTable().getCell(path.row, path.col);
  }

  if (path.col === undefined && path.row !== undefined) {
    value = value.asTableRow().getChild(path.row);
  }

  if (path.col !== undefined && path.row === undefined) {
    value = value.asTableCell().getChild(path.col);
  }

  if (path.child !== undefined) {
    return getCellByPath(<ArgOne>value, path.child);
  }
  return <TableCell>value;
}
