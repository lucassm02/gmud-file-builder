function setText(
  target: Path | undefined,
  tables: GoogleAppsScript.Document.Table[],
  text: string
) {
  if (!target) return;
  if (target.child) {
    const table = tables[target.index].getCell(target.row, target.col);
    const cell = getCell(table, target.child);
    cell.setText(text);
    return;
  }

  if (Array.isArray(target)) {
    for (const itemOfTarget of target) {
      setText(itemOfTarget, tables, text);
    }

    return;
  }

  tables[target.index].getCell(target.row, target.col).setText(text);
}
