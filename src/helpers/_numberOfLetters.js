import { removeNonAlphabetic } from './index';

export default function numberOfLetters(string) {
  return removeNonAlphabetic(string).length;
}
