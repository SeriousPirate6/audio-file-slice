const { getAudioDurationInSeconds } = require("get-audio-duration");

module.exports = {
  getTrackDuration: async (trackPath) => {
    const duration = (await getAudioDurationInSeconds(trackPath)).toFixed(2);

    const min = Math.floor(duration / 60);

    const seconds_cents = duration - min * 60;
    const sec = seconds_cents.toFixed(0);

    const decimal = seconds_cents % 1;
    const frame = (decimal * 100).toFixed(0);

    const song_duration = { min, sec, frame };

    return song_duration;
  },
};
