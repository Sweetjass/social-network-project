import { test, expect, request } from '@playwright/test';
require("dotenv").config();
import util from 'util'

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем описание групп типов разрешений', async () => { 
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState}); // Передаем куки из нашего файла

  const response = await apiContext.get('Enum/groupPermissionType'); // Дергаем ручку Гет

  const data = await response.json(); // Формируем json ответа

  expect(data).toHaveProperty('isSuccess', true);
  data.result.forEach((item: any) => {
    expect(item).toHaveProperty('value');
    expect(item).toHaveProperty('rawDescription');
    expect(item).toHaveProperty('description');
  });
  
  console.log('Ответ:', util.inspect(data, { depth: null, colors: true })); 
  await apiContext.dispose();
});
