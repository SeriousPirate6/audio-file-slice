const fs = require("fs");

module.exports = {
  renameFolder: async ({ oldPath, newPath }) => {
    return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error("Error renaming folder:", err);
          reject();
        } else {
          console.log("Folder renamed successfully.");
          resolve();
        }
      });
    });
  },
};
