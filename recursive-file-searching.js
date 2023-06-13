const fs = require("fs");
const path = require("path");

module.exports = {
  listFilesRecursively: (listFilesRecursively = (
    { folder_path },
    all_files = []
  ) => {
    try {
      const files = fs.readdirSync(folder_path, { withFileTypes: true });

      files.forEach((file) => {
        const file_path = path.join(folder_path, file.name);

        if (file.isFile()) {
          const extension = path.extname(file_path);

          all_files.push({
            file_name: file.name,
            extension,
            folder_path,
            file_path,
          });
        } else if (file.isDirectory()) {
          return listFilesRecursively(
            { folder_path: file_path },
            all_files,
            false
          );
        }
      });

      return all_files;
    } catch (err) {
      console.error(err);
    }
  }),
};
