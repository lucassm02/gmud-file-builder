var formatDate = (date: Date, design: string) => {
  return Utilities.formatDate(date, 'America/Sao_Paulo', design);
};

var parseDate = (date: string, design: string) => {
  return Utilities.parseDate(date, 'America/Sao_Paulo', design);
};
