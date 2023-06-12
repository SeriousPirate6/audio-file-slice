const fs = require("fs");
const cueParser = require("./cue-parser/cue");
const constants = require("./constants/constants");
const moment = require("moment");

module.exports = {
  readCue: async ({ cueFilePath, total_duration }) => {
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

        metadata.tracks = [];

        cueData.files[0].tracks.forEach((track, i) => {
          metadata.tracks.push({
            title: track.title,
            album: cueData.title,
            year: metadata.year,
            genre: metadata.genre,
            artist: cueData.performer,
            track_number: i + 1,
            start_time: track.indexes[0].time,
            end_time: cueData.files[0].tracks[i + 1] // only applicable if the track isn't the last one
              ? (() => {
                  const song_duration =
                    cueData.files[0].tracks[i + 1].indexes[0].time;
                  return {
                    min: song_duration.min,
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
                    )
                    .subtract(
                      moment.duration(
                        `00:${track.indexes[0].time.min}:${track.indexes[0].time.sec}.${track.indexes[0].time.frame}`
                      )
                    );

                  return {
                    min: song_duration.minutes(),
                    sec: song_duration.seconds(),
                    frame: Math.floor(song_duration.milliseconds() / 10),
                  };
                })()
              : (() => {
                  const song_duration = moment
                    .duration(
                      `00:${total_duration.min}:${total_duration.sec}.${total_duration.frame}`
                    )
                    .subtract(
                      moment.duration(
                        `00:${track.indexes[0].time.min}:${track.indexes[0].time.sec}.${track.indexes[0].time.frame}`
                      )
                    );

                  return {
                    min: song_duration.minutes(),
                    sec: song_duration.seconds(),
                    frame: Math.floor(song_duration.milliseconds() / 10),
                  };
                })(),
          });
        });

        console.log(metadata);

        resolve(metadata);
      });
    });
  },
};
