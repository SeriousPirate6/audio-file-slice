module.exports = {
  stringSanitizer: (string) => {
    return string.replace(/[\\/:\*\?"<>\|]/g, "");
  },

  capitalizeFirstLetter: (string) => {
    return string.replace(/^\w/, (c) => c.toUpperCase());
  },
};
