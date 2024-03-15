function getCell(
  tables: GoogleAppsScript.Document.TableCell,
  path: Path
): GoogleAppsScript.Document.TableCell {
  const foundValue: GoogleAppsScript.Document.TableCell = tables
    .getChild(path.index)
    .asTable()
    .getCell(path.row, path.col);

  if (path.child !== undefined) {
    return getCell(foundValue, path.child);
  }

  return foundValue;
}
