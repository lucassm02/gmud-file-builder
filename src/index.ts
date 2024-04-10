function doPost(event: GoogleAppsScript.Events.DoPost) {
  const serializedBody = JSON.parse(event.postData.contents);
  return Controller.post(serializedBody);
}

function doGet(_event: GoogleAppsScript.Events.DoGet) {
  return Controller.get();
}
