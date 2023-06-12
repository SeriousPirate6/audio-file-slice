const { readCue } = require("./read-cue");
const { sliceAndTag } = require("./slice-and-tag");
const { tagCoverImage } = require("./tag-cover");
const { getTechnicalData } = require("./track-technical-data");

(async () => {
  const cueFilePath = "test/coal.cue";
  const audioFilePath = "test/coal.flac";

  const coverFilePath =
    "C:\\Users\\Pirat\\Proj\\audio-file-slice\\test\\cover.jpg";

  const total_metadata = await readCue({ cueFilePath, audioFilePath });

  for await (metadata of total_metadata.tracks) {
    const audioPath = await sliceAndTag({
      inputPath: audioFilePath,
      outputFolder: "test",
      metadata,
    });

    await tagCoverImage({
      imagePath: coverFilePath,
      audioPath: `../${audioPath}`,
    });
  }
})();
