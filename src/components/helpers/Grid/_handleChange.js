import handleTextInput from './_handleTextInput';

function isAlphabetic(key) {
  if (key.length !== 1) return false;
  const charCodeBetween = (char, low, high) => {
    const charCode = char.charCodeAt(0);
    return charCode >= low.charCodeAt(0) && charCode <= high.charCodeAt(0);
  }
  const isLower = charCodeBetween(key, 'a', 'z');
  const isUpper = charCodeBetween(key, 'A', 'Z');
  return isLower || isUpper;
}

export default function handleChange(event, props) {
  if (isAlphabetic(event.target.value)) {
    return handleTextInput(
      event.target.value.toUpperCase(),
      'forwards',
      props
    );
  }
}
