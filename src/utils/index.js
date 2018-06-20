export function isUrl(s) {
  const regexp = /(ftp|http|https)/;
  return regexp.test(s);
}
