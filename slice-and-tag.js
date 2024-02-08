const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { stringSanitizer } = require("./utils/string");

module.exports = {
  sliceAndTag: async ({ inputPath, outputPath, metadata }) => {
    const file_name = stringSanitizer(
      `${
        metadata.track_number <= 9
          ? "0" + metadata.track_number
          : metadata.track_number
      }. ${metadata.artist} - ${metadata.title}${path.extname(inputPath)}`
    );

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(
          `${metadata.start_time.hour}:${metadata.start_time.min}:${metadata.start_time.sec}`
        )
        .setDuration(
          `${metadata.duration.hour}:${metadata.duration.min}:${metadata.duration.sec}`
        )
        .outputOptions([
          "-metadata",
          `title=${
            metadata.title
              ? metadata.title.indexOf(" ") !== -1
                ? metadata.title + " " // trailing space to avoid crash in case of name with spaces in between
                : metadata.title
              : ""
          }`,
          "-metadata",
          `artist=${
            metadata.artist
              ? metadata.artist.indexOf(" ") !== -1
                ? metadata.artist + " "
                : metadata.artist
              : ""
          }`,
          "-metadata",
          `album=${
            metadata.album
              ? metadata.album.indexOf(" ") !== -1
                ? metadata.album + " "
                : metadata.album
              : ""
          }`,
          "-metadata",
          `genre=${
            metadata.genre
              ? metadata.genre.indexOf(" ") !== -1
                ? metadata.genre + " "
                : metadata.genre
              : ""
          }`,
          "-metadata",
          `track=${metadata.track_number}`,
          "-metadata",
          `year=${metadata.year ? metadata.year : ""}`,
        ])
        .output(`${outputPath}/${file_name}`)
        .on("end", function () {
          console.log(`Slicing complete for file: '${file_name}'`);
          resolve(`${outputPath}/${file_name}`);
        })
        .on("error", function (err) {
          reject(console.error("An error occurred:", err.message));
        })
        .run();
    });
  },
};
