export function forceRequireFile (filepath) {
  if (require.cache[filepath]) {
    delete require.cache[filepath];
  }
  let fileContents = require(filepath);
  return fileContents.default || fileContents;
}
