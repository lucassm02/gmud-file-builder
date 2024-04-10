type PostBody = {
  client: string;
  renderMarkdown: boolean;
  variables: Record<string, unknown>;
};

const Controller = {
  post: (body: PostBody) => {
    const client = <'DATORA' | 'SURF'>String(body.client).toUpperCase();
    const templatePaths = paths[<PathKeys>body.client];
    const templateFile = DriveApp.getFileById(GOOGLE_DOCS.TEMPLATE_ID[client]);

    const newFile = templateFile.makeCopy();

    const now = new Date();
    const id = String(now.getTime());
    const fileName = `GMUD ${client} - ${id}`;

    newFile.setName(fileName);

    newFile.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.EDIT
    );

    const document = DocumentApp.openById(newFile.getId());
    const tables = document.getBody().getTables();

    const payload = buildVariablesByClient(
      { ...body.variables, now, id },
      client
    );

    for (const [key, value] of Object.entries(payload)) {
      const target = <Path>templatePaths?.[<keyof typeof templatePaths>key];
      setText(target, tables, <string>value);
    }

    if (body.renderMarkdown) {
      parseMarkdownToGoogleDocs(document.getBody());
    }

    const response = {
      message: `Document successfully generated, access link: ${newFile.getUrl()}`,
    };

    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  },
  get: () => {
    const response = {
      message: 'API online!!!',
    };

    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  },
};
