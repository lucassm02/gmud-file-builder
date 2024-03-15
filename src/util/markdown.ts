type DocumentBody = GoogleAppsScript.Document.Body;

type TextStyle = 'setItalic' | 'setBold';
type ParagraphStyle = GoogleAppsScript.Document.ParagraphHeading;

interface SearchPattern {
  type: 'header' | 'text' | 'list';
  search: string;
  c: number;
  style: unknown;
  marker?: string;
}

function parseMarkdownToGoogleDocs(body: DocumentBody) {
  const headers = [...Array(6)]
    .map((_, i) => ({
      type: 'header',
      search: `^#{${i + 1}} (.*)$`,
      c: i + 1,
      style:
        DocumentApp.ParagraphHeading[
          <GoogleAppsScript.Document.ParagraphHeading>(
            (<unknown>`HEADING${i + 1}`)
          )
        ],
    }))
    .reverse();
  const texts = [...Array(2)]
    .map((_, i) => ({
      type: 'text',
      search: `\\*{${i + 1}}(.*?)\\*{${i + 1}}`,
      c: i + 1,
      style: i == 0 ? 'setItalic' : 'setBold',
    }))
    .reverse();
  const lists = [...Array(2)]
    .map((_, i) => ({
      type: 'list',
      search: `\\* (.*)`,
      marker: '*',
      style:
        DocumentApp.ParagraphHeading[
          <GoogleAppsScript.Document.ParagraphHeading>(
            (<unknown>`HEADING${i + 1}`)
          )
        ],
    }))
    .reverse();
  const searchPatterns = [...headers, ...texts, ...lists];
  const search = (
    body: DocumentBody,
    { type, search, c, style, marker }: SearchPattern
  ) => {
    let s = body.findText(search);
    while (s) {
      const e = s.getElement();
      const start = s.getStartOffset();
      const end = s.getEndOffsetInclusive();
      if (type == 'header') {
        const p = e.getParent();
        if (p.getType() == DocumentApp.ElementType.PARAGRAPH) {
          p.asParagraph()
            .setHeading(<ParagraphStyle>style)
            .editAsText()
            .deleteText(0, c - 1);
        }
      } else if (type == 'text') {
        e.asText()
          [<TextStyle>style](start, end, true)
          .deleteText(end - (c - 1), end)
          .deleteText(start, start + (c - 1));
      } else if (type == 'list') {
        const p = e.getParent();
        if (p.getType() == DocumentApp.ElementType.PARAGRAPH) {
          const text = p.asParagraph().editAsText();
          const pParent = p.getParent().asTableCell();
          text.deleteText(start, start + 1);
          const itemIndex = pParent.getChildIndex(p);

          p.removeFromParent();
          const listItem = pParent.insertListItem(itemIndex, text.getText());
          listItem.setGlyphType(DocumentApp.GlyphType.BULLET);
        }
      }
      s = body.findText(search, s);
    }
  };
  searchPatterns.forEach((o: any) => search(body, o));
}
