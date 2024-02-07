const fs = require("fs");
const path = require("path");

module.exports = {
  listFilesRecursively: (listFilesRecursively = (
    { folder_path },
    all_files = [],
    file_layer = 0
  ) => {
    try {
      const files = fs.readdirSync(folder_path, { withFileTypes: true });

      files.forEach((file) => {
        const file_path = path.join(folder_path, file.name);

        if (file.isFile()) {
          const file_extension = path.extname(file_path);

          all_files.push({
            file_name: file.name.slice(0, file.name.lastIndexOf(".")),
            complete_file_name: file.name,
            file_extension,
            folder_path,
            file_path,
            file_layer,
          });
        } else if (file.isDirectory()) {
          return listFilesRecursively(
            { folder_path: file_path },
            all_files,
            file_layer + 1
          );
        }
      });

      return all_files;
    } catch (err) {
      console.error(err);
    }
  }),

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

  moveFile: async ({ oldPath, newPath }) => {
    if (!fs.lstatSync(oldPath).isFile()) {
      console.log("Both path must represents files");
      return;
    }

    return new Promise((resolve, reject) => {
      fs.copyFile(oldPath, newPath, (err) => {
        if (err) {
          console.error("Error copying file:", err);
          return;
        }

        fs.unlink(oldPath, (err) => {
          if (err) {
            console.error("Error deleting original file:", err);
            reject();
          }

          console.log("File cut successfully.");
          resolve();
        });
      });
    });
  },
};
