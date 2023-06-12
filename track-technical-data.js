const fs = require("fs");
const ffprobe = require("ffprobe");

getTechnicalData = async (audioFilePath) => {
  return new Promise((resolve, reject) => {
    ffprobe(audioFilePath, { path: "ffprobe", opts: "-show_streams" })
      .then((output) => {
        resolve(output);
      })
      .catch((err) => {
        reject(console.error(err));
      });
  });
};

formatDuration = (duration) => {
  duration = Number(duration).toFixed(2);

  const hour = Number(Math.floor(duration / 60 / 60));
  const min = Number(Math.floor(duration / 60) - hour * 60);

  const seconds_cents = duration - min * 60 - hour * 60 * 60;
  const sec = Number(seconds_cents.toFixed(0));

  const decimal = seconds_cents % 1;
  const frame = Number((decimal * 100).toFixed(0));

  const song_duration = { hour, min, sec, frame };

  return song_duration;
};

module.exports = {
  getTechnicalData: async (audioFilePath) => {
    const tech_data = (await getTechnicalData(audioFilePath)).streams[0];
    const fileSizeInBytes = fs.statSync(audioFilePath).size;

    const bit_rate =
      (fileSizeInBytes * 8) / (tech_data.duration_ts / tech_data.sample_rate);

    const track_tech_data = {
      codec_name: tech_data.codec_name,
      codec_long_name: tech_data.codec_long_name,
      codec_type: tech_data.codec_type,
      bit_rate: Number(bit_rate.toFixed(0)),
      sample_rate: Number(tech_data.sample_rate),
      channels: tech_data.channels,
      channel_layout: tech_data.channel_layout,
      duration_ts: tech_data.duration_ts,
      duration: Number(Number(tech_data.duration).toFixed(2)), // toFixed() accepts a number but returns a string
      formatted_duration: formatDuration(tech_data.duration),
      bits_per_raw_sample: Number(tech_data.bits_per_raw_sample),
    };

    console.log(track_tech_data);

    return track_tech_data;
  },

  getBitRate: async (audioFilePath) => {
    const tech_data = await getTechnicalData(audioFilePath);
    return tech_data.bit_rate;
  },

  getSampleRate: async (audioFilePath) => {
    const tech_data = await getTechnicalData(audioFilePath);
    return tech_data.sample_rate;
  },

  getDuration: async (audioFilePath) => {
    const tech_data = await getTechnicalData(audioFilePath);
    return tech_data.duration;
  },

  getFormattedDuration: async (audioFilePath) => {
    const tech_data = await getTechnicalData(audioFilePath);
    return tech_data.formatted_duration;
  },
};
