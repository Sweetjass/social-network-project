import { test, expect, request } from '@playwright/test';
import util from 'util'
require("dotenv").config();

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('API запрос на получение информации о пользователе', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState, // Передаем куки из нашего файла
  });

  const userId = 4; // Сюда кладем нужный ID

  const response = await apiContext.get(`/User/${userId}`); // Дергаем ручку Гет с нужным ID

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа
  console.log('Статус ответа:', response.status()); // Выводим статус
  expect(data).toHaveProperty('isSuccess', true); // Проверяем, что ответ удачный

  if (!data.isSuccess || !data.result || !data.result.user) { // Здесь ставим условие, что если в ответе нет нужных полей, то Пользователь не найден
    console.log('Пользователь не найден');

  } else {
    
    expect(data.result.user).toHaveProperty('userName', data.result.user.userName); // Если пользователь найден - проверяем userName 
    expect(data.result.user).toHaveProperty('id', data.result.user.id); //проверка ID

    const name = data.result.roles.length > 0 ? data.result.roles[0].role.name : 'Роль отсутствует' //проверка на существование роли
    console.log('Пользователь:', util.inspect(data.result, { depth: null, colors: true }));
    console.log('Имя пользователя:', data.result.user.userName, ', Роль: ', name)}; //Выводим всю информацию которая нужна

  await apiContext.dispose();
});
