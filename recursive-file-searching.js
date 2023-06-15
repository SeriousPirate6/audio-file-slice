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
};
