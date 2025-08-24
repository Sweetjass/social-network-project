// eventUtils.ts
import chalk from 'chalk';
import { expect } from '@playwright/test';

export async function checkAndPrintEvents(
  apiContext: any,
  params: URLSearchParams,
  expectedHeader: string,
  stepTitle: string
): Promise<void> {
  console.log();
  console.log(chalk.yellow(stepTitle));

  const response = await apiContext.get(`/SecurityEvent?${params.toString()}`);
  const data = await response.json();

  expect(response.status()).toBe(200);
  expect(data).toHaveProperty('result');
  expect(data.result).toHaveProperty('items');
  expect(Array.isArray(data.result.items)).toBeTruthy();

  const items = data.result.items;

  if (items.length === 0) {
    console.log(chalk.red('События не найдены. Пропускаем проверки элементов.'));
    return; // если нет данных — завершаем функцию
  }

  for (const item of items) {
    expect(item).toHaveProperty('eventType');
    expect(item.eventType).toBe(Number(params.get('EventTypes')));
    expect(item).toHaveProperty('header');
    expect(item.header).toBe(expectedHeader);

    const eventDate = new Date(item.date);
    const start = new Date(params.get('Start') as string);
    const finish = new Date(params.get('Finish') as string);

    expect(eventDate.toString()).not.toBe('Invalid Date');
    expect(eventDate.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(eventDate.getTime()).toBeLessThanOrEqual(finish.getTime());
  }

  const firstItem = items[0];
  console.log();
  console.log('Статус ответа:', response.status());
  console.log();
  console.log(
    chalk.cyan('Найдено:'),
    chalk.yellow(data.result.totalCount),
    chalk.cyan('события типа'),
    chalk.green(`${firstItem.eventType} → '${firstItem.header}'`),
    chalk.cyan('в диапазоне дат между'),
    chalk.red(params.get('Start')!),
    chalk.cyan('и'),
    chalk.red(params.get('Finish')!)
  );

  console.log();

  for (let i = 0; i < items.length; i++) {
    const cleanDesc = items[i].description.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(chalk.magenta(`${i + 1}) ${cleanDesc}`));
  }
}
