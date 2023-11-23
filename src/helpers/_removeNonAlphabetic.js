export default function removeNonAlphabetic(string) {
  return string.replaceAll(/[^a-z]/ig, '');
}
