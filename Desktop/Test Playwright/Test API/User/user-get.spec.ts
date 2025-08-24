import { test, expect, request } from '@playwright/test';
require("dotenv").config();
import util from 'util'

const baseURL = process.env.baseURL
const storageState = process.env.storageState

test('Получаем информацию о всех пользователях', async () => {  ///// ДОБАВИТЬ ФИЛЬТРЫ
  const apiContext = await request.newContext({
    baseURL: baseURL,
    storageState: storageState, // Передаем куки из нашего файла
});

  const params = new URLSearchParams({  //Квери параметры раскоментить для выбора фильтров
    //UserIds: 'int'
    //RoleIds: 'int',          // Фильтр по идентификатору ролей у пользователя
    //NoRoles: 'boolean',        // Фильтр по отсутствию ролей у пользователя: true - только пользователи у которых нет роли(ей); false - только пользователи у которых есть роль(и); null - поиск вне зависимости от наличие роли у пользователя
    //Search: 'string',        // Производит поиск по имени/фамилии пользователя
    //PageIndex: '1',         // Номер страницы
    //PageSize: '4',         // Количество записей на страницу
  });

  const response = await apiContext.get(`/User?${params.toString()}`); //отправляем гет запрос

  expect(response.status()).toBe(200); // Проверяем статус запроса
  const data = await response.json(); // Формируем json ответа

  expect(data).toHaveProperty('result');
  expect(data.result).toHaveProperty('items');
  expect(Array.isArray(data.result.items)).toBe(true);
  expect(data.result).toHaveProperty('totalCount');
  expect(typeof data.result.totalCount).toBe('number');

  data.result.items.forEach(item => {

    const user = item.user;
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('userName')});

  console.log('Статус ответа:', response.status()); // Выводим статус 
  console.log('Ответ:', util.inspect(data, { depth: null, colors: true })); //А так покрасивше с помощью Util
  console.log('Количество пользователей:', data.result.totalCount);
  await apiContext.dispose();
});
