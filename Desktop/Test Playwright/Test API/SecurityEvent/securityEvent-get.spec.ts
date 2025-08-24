import { test, expect, request } from '@playwright/test';
import util from 'util';
import { getDateOffsetFormatted } from '../utils/dateUtils';
  require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Отчет о событиях безопасности с квери параметрами', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});


  const startDate = getDateOffsetFormatted(-2); // Вчера
  const finishDate = getDateOffsetFormatted(1);

  const params = new URLSearchParams({
    Start: startDate,                  // Дата от
    Finish: finishDate,                 // Дата до
    //PageIndex: '1',                     // Номер страницы
    //PageSize: '20',                      // Количество записей на странице
    //Skip: 'int',                          // Сколько записей нужно пропустить (для пагинации)
    //Take: 'int',                          // Сколько записей вернуть (для пагинации)
    //IncludeRaw: 'boolean',                // Указывает возвращать ли json всего события (Boolean)
    //UUIDs: 'arr[str]',                    // Идентификаторы событий
    EventTypes: '1',                // Типы событий
    //SourceUserId: 'string',               // Идентификатор пользователя-источника (пользователя, создавшего данное событие)
    //SourceUserDisplayName: 'string',      // Отображаемое имя пользователя-источника (пользователя, создавшего данное событие)
    //TargetUserId: 'string',               // Идентификатор пользователя-цель (пользователя, к которому относится данное событие)
    //TargetUserDisplayName: 'string'       // Отображаемое имя пользователя-цель (пользователя, к которому относится данное событие)
  });

  const response = await apiContext.get(`/SecurityEvent?${params}`); // Дергаем ручку Гет с нужным ID

   expect(response.status()).toBe(200);

  const data = await response.json();

  expect(data).toHaveProperty('result');
  expect(data.result).toHaveProperty('items');
  expect(Array.isArray(data.result.items)).toBeTruthy();

  console.log('Статус ответа:', response.status()); // Выводим статус
  console.log(util.inspect(data.result, { depth: null, colors: true }));
  await apiContext.dispose();
});
