export default function (num) {
  const n = Number(num);
  let date = new Date(n * 1000)
  const timeTranse = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return timeTranse;
};
