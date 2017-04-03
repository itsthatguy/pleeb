import decache from 'decache';

export function forceRequireFile (filepath) {
  decache(filepath);
  let fileContents = require(filepath);
  return fileContents.default || fileContents;
}
