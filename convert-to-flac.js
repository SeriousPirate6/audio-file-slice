const ffmpeg = require("fluent-ffmpeg");

module.exports = {
  convertToFlac: async ({ fileInput, fileOutput }) => {
    return new Promise((resolve, reject) => {
      ffmpeg(fileInput)
        .toFormat("flac")
        .saveToFile(fileOutput)
        .on("end", () => {
          console.log("Conversion complete");
          resolve(fileOutput);
        })
        .on("error", (err) => {
          console.error("Error:", err);
          reject();
        });
    });
  },
};
