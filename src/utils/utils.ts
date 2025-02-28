export const isoToMMDDYYYY = (isoDate: string): string => {
    const date = new Date(isoDate);
  
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO date string provided.");
    }
  
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
  };