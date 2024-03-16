type Path = { index: number; row: number; col: number; child?: Path };

type RequestBody = {
  date: string;
  client: string;
  startTime: string;
  deployTime: number;
  testTime: number;
  rollbackTime: number;
  requester: string;
  systems: string;
  executor: string;
  description: string;
};

const paths = {
  DATORA: {
    id: { index: 0, row: 1, col: 0 },
    documentDate: { index: 0, row: 1, col: 1 },
    requester: [
      { index: 0, row: 1, col: 2 },
      { index: 2, row: 1, col: 0, child: { index: 1, row: 0, col: 1 } },
    ],
    description: { index: 1, row: 1, col: 0 },
    systems: { index: 14, row: 0, col: 0 },
    activityTimeInMInutes: { index: 22, row: 1, col: 3 },
    rollbackTimeInMinutes: { index: 24, row: 1, col: 3 },
    deployDateTime: [
      { index: 22, row: 1, col: 0 },
      { index: 23, row: 1, col: 0 },
    ],
    deployTestDateTime: { index: 23, row: 2, col: 0 },
    deployEndDateTime: [
      { index: 22, row: 1, col: 1 },
      { index: 23, row: 3, col: 0 },
    ],
    rollbackDateTime: [
      { index: 24, row: 1, col: 0 },
      { index: 25, row: 1, col: 0 },
    ],
    rollbackTesteDateTime: { index: 25, row: 2, col: 0 },
    rollbackEndDateTime: [
      { index: 24, row: 1, col: 1 },
      { index: 25, row: 3, col: 0 },
    ],
    executor: [
      { index: 23, row: 1, col: 2 },
      { index: 23, row: 2, col: 2 },
      { index: 23, row: 3, col: 2 },
      { index: 25, row: 1, col: 2 },
      { index: 25, row: 2, col: 2 },
      { index: 25, row: 3, col: 2 },
    ],
  },
  SURF: {},
};

type PathKeys = keyof typeof paths;

// Payload
// const body = {
//   date: '22/04/24',
//   client: 'DATORA',
//   startTime: '22:00',
//   deployTime: 30,
//   testTime: 20,
//   rollbackTime: 20,
//   requester: 'Lucas Santos',
//   systems: 'SITE, APP, Gestor 360',
//   executor: 'Davi Soares',
//   description:
//     '#### (Correção | Funcionalidade) - Serviço\n* Breve descrição da alteração',
// };

function doGet(event: GoogleAppsScript.Events.DoGet) {
  return ContentService.createTextOutput(`API online!!!`);
}

function doPost(event: GoogleAppsScript.Events.DoPost) {
  var body = <RequestBody>JSON.parse(event.postData.contents);

  const templateFile = DriveApp.getFileById(GOOGLE_DOCS.TEMPLATE_ID);

  const newFile = templateFile.makeCopy();

  const now = new Date();
  const id = String(now.getTime());

  const fileName = `GMUD ${body.client} - ${id}`;

  newFile.setName(fileName);

  newFile.setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.EDIT
  );

  const document = DocumentApp.openById(newFile.getId());
  const tables = document.getBody().getTables();

  const documentDate = formatDate(now, 'dd/MM/yyyy');
  const [hours, minutes] = body.startTime.split(':').map(Number);

  const deployStartTimeDateObject = parseDate(body.date, 'dd/MM/yy');

  deployStartTimeDateObject.setHours(hours);
  deployStartTimeDateObject.setMinutes(minutes);

  const deployTestTimeDateObject = new Date(deployStartTimeDateObject);
  deployTestTimeDateObject.setMinutes(
    deployTestTimeDateObject.getMinutes() + body.deployTime
  );

  const deployEndTimeDateObject = new Date(deployTestTimeDateObject);
  deployEndTimeDateObject.setMinutes(
    deployEndTimeDateObject.getMinutes() + body.testTime
  );

  const rollbackTestTimeDateObject = new Date(deployEndTimeDateObject);
  rollbackTestTimeDateObject.setMinutes(
    rollbackTestTimeDateObject.getMinutes() + body.rollbackTime
  );

  const rollbackEndTimeDateObject = new Date(rollbackTestTimeDateObject);
  rollbackEndTimeDateObject.setMinutes(
    rollbackEndTimeDateObject.getMinutes() + body.testTime
  );

  const activityTimeInMInutes = `${body.deployTime + body.testTime} minutos`;
  const rollbackTimeInMinutes = `${body.rollbackTime + body.testTime} minutos`;

  const dateTimeMask = 'dd/MM/yy - HH:mm';

  const deployDateTime = formatDate(deployStartTimeDateObject, dateTimeMask);
  const deployTestDateTime = formatDate(deployTestTimeDateObject, dateTimeMask);
  const deployEndDateTime = formatDate(deployEndTimeDateObject, dateTimeMask);
  const rollbackDateTime = deployEndDateTime;
  const rollbackTesteDateTime = formatDate(
    rollbackTestTimeDateObject,
    dateTimeMask
  );
  const rollbackEndDateTime = formatDate(
    rollbackEndTimeDateObject,
    dateTimeMask
  );

  const payload = {
    ...body,
    id,
    documentDate,
    activityTimeInMInutes,
    rollbackTimeInMinutes,
    deployDateTime,
    deployTestDateTime,
    deployEndDateTime,
    rollbackDateTime,
    rollbackTesteDateTime,
    rollbackEndDateTime,
  };

  const templatePaths = paths[<PathKeys>body.client];

  for (const [key, value] of Object.entries(payload)) {
    const target: Path = templatePaths?.[<keyof typeof templatePaths>key];
    setText(target, tables, <string>value);
  }

  parseMarkdownToGoogleDocs(document.getBody());

  const response = {
    message: `Document successfully generated, access link: ${newFile.getUrl()}`,
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}
