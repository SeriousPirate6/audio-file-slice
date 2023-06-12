const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

module.exports = {
  sliceAndTag: async ({ inputPath, outputFolder, metadata }) => {
    const tech_data = metadata.technical_info;

    const sub_folder = `${metadata.artist} - ${metadata.album} (${
      metadata.year
    }) [${tech_data.bits_per_raw_sample}bits-${Math.floor(
      tech_data.sample_rate / 1000
    )}kHz] ${tech_data.codec_name.toUpperCase()}`;

    const full_path = `${outputFolder}/${sub_folder}`;

    if (!fs.existsSync(full_path)) {
      fs.mkdirSync(full_path);
    }

    const file_name = `${
      metadata.track_number <= 9
        ? "0" + metadata.track_number
        : metadata.track_number
    }. ${metadata.artist} - ${metadata.title}${path.extname(inputPath)}`;

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
        .output(`${full_path}/${file_name}`)
        .on("end", function () {
          console.log("Slicing complete: ", file_name);
          resolve(`${full_path}/${file_name}`);
        })
        .on("error", function (err) {
          reject(console.error("An error occurred:", err.message));
        })
        .run();
    });
  },
};
