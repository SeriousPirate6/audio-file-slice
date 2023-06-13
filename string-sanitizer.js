module.exports = {
  stringSanitizer: (string) => {
    return string.replace(/[\\/:\*\?"<>\|]/g, "");
  },
};
