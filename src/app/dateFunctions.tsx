export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Septembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
export function getToday() {
  const date = new Date().toISOString().split("T")[0];
  return date;
}

export function formatMonth(isoMonth: string) {
  const [year, month] = isoMonth.split("-");
  return `${MONTHS[parseInt(month) - 1]} de ${year}`;
}

export function addMonths(month: string, increment: number) {
  const jsDate = new Date(month + "-01T12:00:00");
  jsDate.setMonth(jsDate.getMonth() + increment);
  return `${jsDate.getFullYear()}-${(jsDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}
