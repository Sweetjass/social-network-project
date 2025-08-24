import { test, expect, request } from '@playwright/test';
require("dotenv").config();
import util from 'util'

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем все существующие группы разрешений', async () => {  
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState}); // Передаем куки из нашего файла

  const response = await apiContext.get('/GroupPermission'); // Дергаем ручку Гет

  expect(response.status()).toBe(200); // Проверяем статус запроса
  
  const data = await response.json(); // Формируем json ответа

  data.result.forEach((group: any, index: number) => {
    expect(group).toHaveProperty('groupType');
    expect(group).toHaveProperty('permissions')});
  console.log('Статус ответа:', response.status()); // Выводим статус 
  console.info('Ответ:', util.inspect(data, { depth: null, colors: true })); //А так покрасивше с помощью Util
  console.log('Количество групп:', data.result.length);
  await apiContext.dispose();
});
