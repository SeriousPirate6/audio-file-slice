const path = require("path");
const { exec } = require("child_process");
const constants = require("./constants/constants");

module.exports = {
  tagCoverImage: async ({ coverImage, audioPath }) => {
    const command = `metaflac --import-picture-from="${coverImage}" "${audioPath}"`;

    return new Promise((resolve, reject) => {
      exec(
        command,
        {
          cwd: constants.META_FLAC_DIR,
        },
        function (error) {
          if (error) {
            reject(
              console.error("Failed to add thumbnail to the FLAC file:", error)
            );
          } else {
            resolve(
              console.log(
                `Thumbnail added successfully for: '${path.basename(
                  audioPath
                )}'`
              )
            );
          }
        }
      );
    });
  },
};
