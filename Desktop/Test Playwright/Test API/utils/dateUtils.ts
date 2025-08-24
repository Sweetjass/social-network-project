export function getTodayDateFormatted(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Месяцы от 0 до 11
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Получает дату, отстоящую на n дней от текущей.
 * @param daysOffset - Смещение в днях (отрицательное для прошлых дат, положительное для будущих).
 * @returns Дата в формате 'YYYY-MM-DD'.
 */
export function getDateOffsetFormatted(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
