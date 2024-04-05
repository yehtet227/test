export const useInputValidation = () => {
  const validateInput = (e) => {
      try {
          if (!e?.target?.value) {
              return
          }
          const value = e.target.value;
          const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
          if (!regex.test(value)) {
            e.target.value = value.slice(0, -1);
          }
      } catch (error) {
          throw error; 
      }
  }

  const formatDate = (inputDateString) => {
    if(inputDateString) {
      const inputDate = new Date(inputDateString);
      const year = inputDate.getFullYear();
      const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
      const day = inputDate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
      } else {
          return '';
      }
  }

  const countMonthsInclusive = (startDate, endDate) => {
    if(!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
  
    const monthsBetween = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  
    return monthsBetween;
  }

  return {validateInput, formatDate, countMonthsInclusive}
}