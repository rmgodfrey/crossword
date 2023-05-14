export default function getLength(answer) {
  return answer.replaceAll(/[- ]/g, '').length;
}
