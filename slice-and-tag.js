const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

module.exports = {
  sliceAndTag: ({ inputPath, outputFolder, metadata }) => {
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
          metadata.title.indexOf(" ") !== -1
            ? metadata.title + " " // trailing space to avoid crash in case of name with spaces in between
            : metadata.title
        }`,
        "-metadata",
        `artist=${
          metadata.artist.indexOf(" ") !== -1
            ? metadata.artist + " "
            : metadata.artist
        }`,
        "-metadata",
        `album=${
          metadata.album.indexOf(" ") !== -1
            ? metadata.album + " "
            : metadata.album
        }`,
        "-metadata",
        `genre=${
          metadata.genre.indexOf(" ") !== -1
            ? metadata.genre + " "
            : metadata.genre
        }`,
        "-metadata",
        `year=${
          metadata.year.indexOf(" ") !== -1
            ? metadata.year + " "
            : metadata.year
        }`,
      ])
      .output(
        `${outputFolder}/${
          metadata.track_number <= 9
            ? "0" + metadata.track_number
            : metadata.track_number
        }. ${metadata.artist} - ${metadata.title}${path.extname(inputPath)}`
      )
      .on("end", function () {
        console.log("Slicing complete");
      })
      .on("error", function (err) {
        console.error("An error occurred:", err.message);
      })
      .run();
  },
};
