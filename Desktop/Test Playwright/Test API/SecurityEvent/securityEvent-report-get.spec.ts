import { test, expect, request } from '@playwright/test';
import { writeFileSync } from 'fs';
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Отчет по событиям безопасности в виде Excel файла', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState});

  const params = new URLSearchParams({
    Start: '2025-06-13',                  // Дата от
    Finish: '2025-06-18',                 // Дата до
    //PageIndex: 'int',                     // Номер страницы
    //PageSize: 'int',                      // Количество записей на странице
    //Skip: 'int',                          // Сколько записей нужно пропустить (для пагинации)
    //Take: 'int',                          // Сколько записей вернуть (для пагинации)
    //IncludeRaw: 'boolean',                // Указывает возвращать ли json всего события (Boolean)
    //UUIDs: 'arr[str]',                    // Идентификаторы событий
    //EventTypes: 'arr[int]',               // Типы событий
    //SourceUserId: 'string',               // Идентификатор пользователя-источника (пользователя, создавшего данное событие)
    //SourceUserDisplayName: 'string',      // Отображаемое имя пользователя-источника (пользователя, создавшего данное событие)
    //TargetUserId: 'string',               // Идентификатор пользователя-цель (пользователя, к которому относится данное событие)
    //TargetUserDisplayName: 'string'       // Отображаемое имя пользователя-цель (пользователя, к которому относится данное событие)
  });

  const response = await apiContext.get(`/SecurityEvent/report?${params.toString()}`); // Дергаем ручку Гет с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса
  
  expect(response.headers()['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); // Проверяем, что Content-Type соответствует Excel

  const buffer = await response.body();   // Получаем тело ответа как буфер (binary)
  expect(buffer.length).toBeGreaterThan(0); // Проверка, что тело не пустое
  writeFileSync('report.xlsx', buffer);
  
  await apiContext.dispose();
});
