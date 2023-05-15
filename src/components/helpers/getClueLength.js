function getAnswer(clue) {
  let answer = clue.fragments.map(fragment => (
    fragment.answer
  )).join('');
  return answer.replace(/-{2}/, '-').replace(/ {2}/, ' ');
}

export default function getClueLength(clue) {
  const answer = getAnswer(clue);
  let length = 0;
  let result = ''
  for (let char of answer) {
    if (/[a-z]/i.test(char)) {
      length++;
    } else {
      result += length + char;
      length = 0;
    }
  }
  return result + length;
}
