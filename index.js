const { readCue } = require("./read-cue");
const { sliceAndTag } = require("./slice-and-tag");
const { getTrackDuration } = require("./track-duration");

(async () => {
  const cueFilePath = "test/coal.cue";
  const trackFilePath = "test/coal.flac";
  const coverFilePath = "test/cover.jpg";

  const total_duration = await getTrackDuration(trackFilePath);
  const metadata = await readCue({ cueFilePath, total_duration });

  sliceAndTag({
    inputPath: trackFilePath,
    outputFolder: "test",
    metadata: metadata.tracks[9],
  });
})();
