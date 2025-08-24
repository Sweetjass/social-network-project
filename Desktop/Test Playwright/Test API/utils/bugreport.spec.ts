// import { test, chromium, expect } from '@playwright/test';
// import dotenv from 'dotenv';

// dotenv.config();

// test('Create bug via Azure DevOps UI with httpCredentials', async () => {
//   const browser = await chromium.launch();
//   const context = await browser.newContext({
//     httpCredentials: {
//       username: process.env.AZURE_LOGIN!,
//       password: process.env.AZURE_PASSWORD!,
//     },
//     ignoreHTTPSErrors: true,
//   });
//   const page = await context.newPage();

//   try {
//     // Перейти на страницу
//     await page.goto('https://az.megapolis-it.ru:444/rms/asudd/_sprints/taskboard/asudd%20Team/asudd/25_10');

//     // Дальше ваша логика создания бага:
//     await page.click('div.add-new-item[aria-label="Добавить элемент"]');
//     await page.waitForSelector('text=Bug');
//     await page.click('text=Bug');

//     await page.fill('input[aria-label="Title"]', 'Автоматический баг из теста авторизации');
//     await page.fill('textarea[aria-label="Description"]', 'Описание бага с подробностями...');
//     await page.fill('textarea[aria-label="Repro Steps"]', 'Шаги воспроизведения...');

//     await page.click('button[aria-label="Save Work Item"]');

//     await expect(page.locator('text=Work item successfully created')).toBeVisible({ timeout: 10000 });
//   } catch (error) {
//     console.error('Error creating bug via UI:', error);
//     await page.screenshot({ path: 'error-screenshot.png' });
//     throw error;
//   } finally {
//     await context.close();
//     await browser.close();
//   }
// });
