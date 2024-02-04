const ffmpeg = require("fluent-ffmpeg");

module.exports = {
  metadataFromTrack: async (filePath) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          console.error("Error getting metadata:", err);
          reject();
        }
        resolve(metadata.format.tags);
      });
    });
  },
};
