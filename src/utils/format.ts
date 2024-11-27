interface GetDateProps {
  addedDate?: number;
  date?: number;
}
const getDate = ({ addedDate = 3, date = Date.now() }: GetDateProps) => {
  const time = new Date(date);
  time.setDate(time.getDate() + addedDate);
  return time;
};

export { getDate };