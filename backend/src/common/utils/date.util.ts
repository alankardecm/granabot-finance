export const parseDate = (value: string | Date | undefined) => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return undefined;
  }
  return parsed;
};

export const normalizeDateRange = (from?: Date, to?: Date) => {
  const start = from ? new Date(from) : undefined;
  const end = to ? new Date(to) : undefined;

  if (start) {
    start.setHours(0, 0, 0, 0);
  }

  if (end) {
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};
