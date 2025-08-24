import { test } from '@playwright/test';
require("dotenv").config();

const login = process.env.LOGIN;
const password = process.env.PASSWORD;

test('Сохранение куки и авторизация', async ({ page }) => {
  await page.goto('https://asudd-rolemanager-apihub.dev.megapolis-it.pro/swagger/index.html');
  await page.waitForTimeout(1000);
  await page.fill('#Username', login as string);
  await page.fill('#Password', password as string);
  await page.waitForTimeout(1000);
  await page.click('button[type=submit]');
  await page.waitForTimeout(1000);
   // Вручную переходим на нужный URL
  await page.goto('https://asudd-rolemanager-apihub.dev.megapolis-it.pro/swagger/index.html');
  // Ждём загрузки страницы пользователя
  //await page.waitForSelector('text=Пользователи');
  // Сохраняем состояние
  const storagePath = 'playwright/.auth/storageState.json';
  await page.context().storageState({ path: storagePath });
  console.log('Куки успешно сохранены')
});
