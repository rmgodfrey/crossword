function getLength(answer) {
  return answer.replaceAll(/[- ]/g, '').length;
}

export { getLength };
