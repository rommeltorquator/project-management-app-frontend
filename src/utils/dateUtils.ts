// src/utils/dateUtils.ts

export const formatDateToInput = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return ''; // Return empty string if invalid date
  }
  return date.toISOString().split('T')[0];
};

export const convertDateToISO = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return ''; // Return empty string if invalid date
  }
  return date.toISOString();
};
