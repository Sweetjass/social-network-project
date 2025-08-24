import { test, expect, request } from '@playwright/test';
require("dotenv").config();

const baseURL = process.env.baseURL;
const storageState = process.env.storageState

test('Получение информации о пользователе по внешнему идентификатору', async () => {
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState // Передаем куки из нашего файла
  });

  const userId = 100; // Сюда кладем нужный ВНЕШНИЙ ID!
  const response = await apiContext.get(`/User/byUserId?userId=${userId}`); // Дергаем ручку Гет с нужным ВНЕШНИМ ID

  expect(response.status()).toBe(200); // Проверяем статус ответа

  const data = await response.json(); // Формируем json ответа
  
  console.log('Статус ответа:', response.status()); // Выводим статус

  //console.log("Ответ", data.result) // Если нужен полный ответ оставим вот это

  if (!data.isSuccess || !data.result || !data.result.user) { // Здесь ставим условие, что если в ответе нет нужных полей, то Пользователь не найден
    console.log('Пользователь не найден');
} else {
    expect(data.result.user).toHaveProperty('userName'); // Если пользователь найден - проверяем userName 
  
  const name = data.result.roles.length > 0 ? data.result.roles[0].role.name : 'Роль отсутствует' //проверка на существование роли
  console.log('UserName:', data.result.user.userName, ', Роль: ', name)}; //Выводим всю информацию которая нужна

  await apiContext.dispose();
});
