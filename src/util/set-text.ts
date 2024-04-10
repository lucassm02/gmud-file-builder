function setText(
  target: Path | undefined,
  tables: GoogleAppsScript.Document.Table[],
  text: string
) {
  if (!target) return;

  if (Array.isArray(target)) {
    for (const itemOfTarget of target) {
      setText(itemOfTarget, tables, text);
    }

    return;
  }

  const cell = getCellByPath(tables, target);
  cell.editAsText().setText(text);
}
