function createBaybolClientForm() {
  const form = FormApp.create('BAYBOL — Анкета клиента');
  form.setDescription(
    'Пожалуйста, заполните анкету внимательно.\n\n' +
    'Имя и фамилию указывайте ЛАТИНИЦЕЙ строго так, как они написаны в заграничном паспорте. ' +
    'Не сокращайте данные и не придумывайте сведения. Если поле к вам не относится, оставьте его пустым, если форма позволяет.'
  );
  form.setConfirmationMessage(
    'Анкета успешно отправлена. Спасибо. После отправки анкеты передайте менеджеру BayBol требуемые документы в том формате, который он запросил.'
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);

  addChoice_(form, 'В какую страну вы оформляетесь?', ['Польша', 'Словакия'], true);

  addText_(form, 'Имя', 'Латиницей, строго как в заграничном паспорте.', true);
  addText_(form, 'Фамилия', 'Латиницей, строго как в заграничном паспорте.', true);
  addText_(form, 'Девичья фамилия', 'Если применимо. Если девичьей фамилии нет, оставьте поле пустым.', false);

  addChoice_(form, 'Менялась ли у вас когда-либо фамилия?', ['Да', 'Нет'], true);
  addText_(form, 'Предыдущая фамилия', 'Заполняйте только если фамилия менялась. Укажите предыдущую фамилию точно по документам.', false);

  addChoice_(form, 'Пол', ['Мужской', 'Женский'], true);
  addDate_(form, 'Дата рождения', true);
  addText_(form, 'Место рождения', 'Страна, область/регион, город или населённый пункт, как указано в документах.', true);

  addChoice_(
    form,
    'Семейное положение',
    ['Не женат / не замужем', 'Женат / замужем', 'Разведён / разведена', 'Вдовец / вдова', 'Другое'],
    true
  );

  addText_(form, 'Номер заграничного паспорта', 'Без ошибок, строго как в паспорте.', true);
  addDate_(form, 'Дата выдачи заграничного паспорта', true);
  addDate_(form, 'Срок действия заграничного паспорта', true);
  addText_(form, 'ИИН', '12 цифр, если у вас есть ИИН.', false);
  addText_(form, 'Кем выдан паспорт', 'Укажите орган, выдавший паспорт, если информация есть в документе.', false);

  form.addSectionHeaderItem().setTitle('Адрес проживания');
  addText_(form, 'Область / регион', '', true);
  addText_(form, 'Город / населённый пункт', '', true);
  addText_(form, 'Улица', '', true);
  addText_(form, 'Дом / здание', '', true);
  addText_(form, 'Квартира', 'Если квартиры нет, оставьте поле пустым.', false);
  addText_(form, 'Почтовый индекс', '', true);

  form.addSectionHeaderItem().setTitle('Контактные данные');
  addText_(form, 'Электронная почта', 'Укажите действующую электронную почту.', true);
  addText_(form, 'Номер телефона', 'Укажите номер с кодом страны, например +7 777 123 45 67.', true);

  form.addSectionHeaderItem().setTitle('Визы за последние 3 года');
  addChoice_(form, 'Были ли у вас визы за последние 3 года?', ['Да', 'Нет'], true);
  addText_(form, 'Страна визы', 'Если виз за последние 3 года не было, оставьте поле пустым.', false);
  addText_(form, 'Тип визы', 'Например: рабочая, туристическая, национальная, шенгенская. Указывайте только если знаете точно.', false);
  addDate_(form, 'Виза действовала с', false);
  addDate_(form, 'Виза действовала до', false);

  const responseSpreadsheet = SpreadsheetApp.create('BAYBOL — НОВЫЕ АНКЕТЫ');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, responseSpreadsheet.getId());

  createMappingSheet_(responseSpreadsheet);

  Logger.log('Ссылка для клиентов: ' + form.getPublishedUrl());
  Logger.log('Ссылка для редактирования формы: ' + form.getEditUrl());
  Logger.log('Таблица ответов: ' + responseSpreadsheet.getUrl());

  return {
    publicFormUrl: form.getPublishedUrl(),
    editFormUrl: form.getEditUrl(),
    responseSpreadsheetUrl: responseSpreadsheet.getUrl()
  };
}

function addText_(form, title, helpText, required) {
  const item = form.addTextItem().setTitle(title).setRequired(required);
  if (helpText) item.setHelpText(helpText);
  return item;
}

function addDate_(form, title, required) {
  return form.addDateItem().setTitle(title).setRequired(required);
}

function addChoice_(form, title, choices, required) {
  const item = form.addMultipleChoiceItem().setTitle(title).setRequired(required);
  item.setChoiceValues(choices);
  return item;
}

function createMappingSheet_(ss) {
  let sheet = ss.getSheetByName('СТАНДАРТ BAYBOL');
  if (!sheet) sheet = ss.insertSheet('СТАНДАРТ BAYBOL');

  const rows = [
    ['Вопрос формы', 'Поле BayBol'],
    ['В какую страну вы оформляетесь?', 'COUNTRY'],
    ['Имя', '1. FIRST NAME'],
    ['Фамилия', '2. LAST NAME'],
    ['Девичья фамилия', '3. MAIDEN NAME'],
    ['Менялась ли у вас когда-либо фамилия?', '4. HAS YOUR SURNAME EVER CHANGED?'],
    ['Предыдущая фамилия', '5. PREVIOUS SURNAME'],
    ['Пол', '6. GENDER'],
    ['Дата рождения', '7. DATE OF BIRTH'],
    ['Место рождения', '8. PLACE OF BIRTH'],
    ['Семейное положение', '9. MARITAL STATUS'],
    ['Номер заграничного паспорта', '10. PASSPORT NUMBER'],
    ['Дата выдачи заграничного паспорта', '11. DATE OF ISSUE'],
    ['Срок действия заграничного паспорта', '12. VALID UNTIL'],
    ['ИИН', '13. IIN'],
    ['Кем выдан паспорт', '14. ISSUED BY'],
    ['Область / регион', '15. REGION / OBLAST'],
    ['Город / населённый пункт', '16. CITY'],
    ['Улица', '17. STREET'],
    ['Дом / здание', '18. HOUSE / BUILDING'],
    ['Квартира', '19. APARTMENT'],
    ['Почтовый индекс', '20. POSTAL CODE'],
    ['Электронная почта', '21. EMAIL'],
    ['Номер телефона', '22. PHONE NUMBER'],
    ['Были ли у вас визы за последние 3 года?', '23. VISA IN THE LAST 3 YEARS?'],
    ['Страна визы', '24. VISA COUNTRY'],
    ['Тип визы', '25. VISA TYPE'],
    ['Виза действовала с', '26. VISA VALID FROM'],
    ['Виза действовала до', '27. VISA VALID UNTIL']
  ];

  sheet.clear();
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 2);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
}
