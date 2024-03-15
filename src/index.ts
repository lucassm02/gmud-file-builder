type Path = { index: number; row: number; col: number; child?: Path };

const paths = {
  DATORA: {
    id: { index: 0, row: 1, col: 0 },
    documentDate: { index: 0, row: 1, col: 1 },
    requester: [
      { index: 0, row: 1, col: 2 },
      { index: 2, row: 1, col: 0, child: { index: 1, row: 0, col: 1 } },
    ],
    description: { index: 1, row: 1, col: 0 },
    category: { index: 0, row: 1, col: 0 },
  },
  SURF: {},
};

type PathKeys = keyof typeof paths;

const body = {
  date: '22/04/24',
  client: 'DATORA',
  startTime: '22:00',
  deployTime: 30,
  testTime: 20,
  rollbackTime: 20,
  requester: 'Lucas Santos',
  systems: 'Site, APP, Gestor 360',
  executor: 'Davi Soares',
  description:
    '#### (Correção | Funcionalidade) - Serviço\n* Breve descrição da alteração',
};

function doGet(event: GoogleAppsScript.Events.DoGet) {
  const templateFile = DriveApp.getFileById(GOOGLE_DOCS.TEMPLATE_ID);
  //const newFile = templateFile.makeCopy()
  const now = new Date();
  const id = String(now.getTime());

  const fileName = `GMUD ${body.client} - ${id}`;

  // newFile.setName(fileName) colum

  const document = DocumentApp.openById(templateFile.getId());

  const tables = document.getBody().getTables();

  const documentDate = formatDate(now, 'dd/MM/yyyy');

  const payload = { id, documentDate, ...body };

  const templatePaths = paths[<PathKeys>body.client];

  for (const [key, value] of Object.entries(payload)) {
    const target: Path = templatePaths?.[<keyof typeof templatePaths>key];
    setText(target, tables, <string>value);
  }

  parseMarkdownToGoogleDocs(document.getBody());

  //console.log(tables[author.index].getCell(author.row,author.col).getText())

  // return ContentService.createTextOutput(document.getBody().getText());
}

function doPost(event: GoogleAppsScript.Events.DoPost) {
  console.log(event);
  var data = event.postData.contents;
  return ContentService.createTextOutput('Received POST data: ' + data);
}
