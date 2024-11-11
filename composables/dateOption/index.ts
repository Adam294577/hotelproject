import { ref } from "vue";

export const useDateOption = () => {
  const hasDay31: number[] = [1, 3, 5, 7, 8, 10, 12];
  const hasDay30: number[] = [4, 6, 9, 11];

  const currentYear = new Date().getFullYear();
  const yearOpt = ref<number[]>(
    Array.from({ length: 100 }, (_, i) => currentYear - i - 1).reverse()
  );
  const monthOpt = ref<number[]>(Array.from({ length: 12 }, (_, i) => i + 1));
  const dayOpt = ref<number[]>([]);

  const updateDayOpt = (month: number, year: number) => {
    if (!month) {
      dayOpt.value = [];
      return;
    }

    if (hasDay31.includes(month)) {
      dayOpt.value = Array.from({ length: 31 }, (_, i) => i + 1);
    } else if (hasDay30.includes(month)) {
      dayOpt.value = Array.from({ length: 30 }, (_, i) => i + 1);
    } else if (month === 2) {
      // 更精確的閏年判斷
      const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      dayOpt.value = Array.from(
        { length: isLeapYear ? 29 : 28 },
        (_, i) => i + 1
      );
    }
  };

  return {
    yearOpt,
    monthOpt,
    dayOpt,
    updateDayOpt,
  };
};
