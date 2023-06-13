const fs = require("fs");
const cueParser = require("./cue-parser/cue");
const constants = require("./constants/constants");
const moment = require("moment");
const { getTechnicalData } = require("./track-technical-data");

module.exports = {
  readCue: async ({ cueFilePath, audioFilePath }) => {
    const technical_info = await getTechnicalData(audioFilePath);
    const total_duration = technical_info.formatted_duration;

    return new Promise(function (resolve, reject) {
      fs.readFile(cueFilePath, "utf8", (err) => {
        if (err) {
          reject(console.error(err));
        }

        const cueData = cueParser.parse(cueFilePath);

        const metadata = {};

        metadata.artist = cueData.performer;
        metadata.album = cueData.title;

        const genre = constants.GENRE;
        const date = constants.DATE;

        cueData.rem.forEach((prop) => {
          if (prop.includes(genre))
            metadata.genre = prop.replace(genre, "").replaceAll('"', "").trim();
          if (prop.includes(date))
            metadata.year = prop.replace(date, "").replaceAll('"', "").trim();
        });

        metadata.technical_info = technical_info;
        metadata.tracks = [];

        cueData.files[0].tracks.forEach((track, i) => {
          metadata.tracks.push({
            title: track.title,
            album: cueData.title,
            year: Number(metadata.year),
            genre: metadata.genre,
            artist: cueData.performer,
            track_number: i + 1,
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
            end_time: cueData.files[0].tracks[i + 1] // only applicable if the track isn't the last one
              ? (() => {
                  const song_duration =
                    cueData.files[0].tracks[i + 1].indexes[0].time;
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
            duration: cueData.files[0].tracks[i + 1]
              ? (() => {
                  const next_song_start =
                    cueData.files[0].tracks[i + 1].indexes[0].time;

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
      });
    });
  },
};
