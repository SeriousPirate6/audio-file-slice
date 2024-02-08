const fs = require("fs");
const moment = require("moment");
const cueParser = require("./cue-parser/cue");
const constants = require("./constants/constants");
const { getTechnicalData } = require("./track-technical-data");
const { capitalizeFirstLetter } = require("./utils/string");

module.exports = {
  readCue: async ({ cueFilePath, audioFile }) => {
    const technical_info = await getTechnicalData(audioFile.file_path);
    const total_duration = technical_info.formatted_duration;

    return new Promise(function (resolve, reject) {
      fs.readFile(cueFilePath, "utf8", (err) => {
        if (err) {
          reject(console.error(err));
        }

        const cueData = cueParser.parse(cueFilePath);

        const metadata = {};

        metadata.artist = capitalizeFirstLetter(cueData.performer);
        metadata.album = capitalizeFirstLetter(cueData.title);

        const genre = capitalizeFirstLetter(constants.GENRE);
        const date = capitalizeFirstLetter(constants.DATE);

        cueData.rem.forEach((prop) => {
          if (prop.includes(genre))
            metadata.genre = prop.replace(genre, "").replaceAll('"', "").trim();
          if (prop.includes(date))
            metadata.year = prop.replace(date, "").replaceAll('"', "").trim();
        });

        metadata.technical_info = technical_info;
        metadata.tracks = [];

        /* fetching the file corresponding to the track title */
        const file = cueData.files.find(
          (file) => file.name === audioFile.complete_file_name
        );

        if (file) {
          file.tracks.forEach((track, i) => {
            metadata.tracks.push({
              title: capitalizeFirstLetter(track.title),
              album: capitalizeFirstLetter(cueData.title),
              year: Number(metadata.year),
              genre: capitalizeFirstLetter(metadata.genre),
              artist: capitalizeFirstLetter(cueData.performer),
              track_number: track.number,
              start_time:
                track.indexes[0].time.min < 60
                  ? (() => {
                      return {
                        hour: 0,
                        min: track.indexes[0].time.min,
                        sec: track.indexes[0].time.sec,
                        frame: track.indexes[0].time.frame,
                      };
                    })()
                  : (() => {
                      const start_time = track.indexes[0].time;
                      const hour = Math.floor(start_time.min / 60);

                      return {
                        hour,
                        min:
                          start_time.min < 60
                            ? start_time.min
                            : start_time.min - hour * 60,
                        sec: start_time.sec,
                        frame: start_time.frame,
                      };
                    })(),
              end_time: file.tracks[i + 1] // only applicable if the track isn't the last one
                ? (() => {
                    const song_duration = file.tracks[i + 1].indexes[0].time;
                    const hour = Math.floor(song_duration.min / 60);

                    return {
                      hour,
                      min:
                        song_duration.min < 60
                          ? song_duration.min
                          : song_duration.min - hour * 60,
                      sec: song_duration.sec,
                      frame: song_duration.frame,
                    };
                  })()
                : total_duration,
              duration: file.tracks[i + 1]
                ? (() => {
                    const next_song_start = file.tracks[i + 1].indexes[0].time;

                    const song_duration = moment
                      .duration(
                        `00:${next_song_start.min}:${next_song_start.sec}.${next_song_start.frame}`
                        // setting hour at 0 because in .cue files they are never used.
                        // the minutes can be setted further than 59.
                      )
                      .subtract(
                        moment.duration(
                          `00:${track.indexes[0].time.min}:${track.indexes[0].time.sec}.${track.indexes[0].time.frame}`
                        )
                      );

                    return {
                      hour: song_duration.hours(),
                      min: song_duration.minutes(),
                      sec: song_duration.seconds(),
                      frame: Math.floor(song_duration.milliseconds() / 10),
                    };
                  })()
                : (() => {
                    const song_duration = moment
                      .duration(
                        `${total_duration.hour}:${total_duration.min}:${total_duration.sec}.${total_duration.frame}`
                      )
                      .subtract(
                        moment.duration(
                          `00:${track.indexes[0].time.min}:${track.indexes[0].time.sec}.${track.indexes[0].time.frame}`
                        )
                      );

                    return {
                      hour: song_duration.hours(),
                      min: song_duration.minutes(),
                      sec: song_duration.seconds(),
                      frame: Math.floor(song_duration.milliseconds() / 10),
                    };
                  })(),
              technical_info,
            });
          });

          console.log(metadata);

          resolve(metadata);
        } else {
          console.log(
            `Track ${audioFile.complete_file_name} not found in .cue file.`
          );
          resolve();
        }
      });
    });
  },
};
