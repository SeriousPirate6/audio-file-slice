const { readCue } = require("./read-cue");
const { sliceAndTag } = require("./slice-and-tag");
const { tagCoverImage } = require("./tag-cover");
const { getTechnicalData } = require("./track-technical-data");
const { listFilesRecursively } = require("./recursive-file-searching");

(async () => {
  const folder_path =
    "E:\\Pirat\\Music\\Leprous [Vinyl]\\2015 - The Congregation";

  const all_files = listFilesRecursively({ folder_path });

  const cueFile = all_files.find((e) => e.extension === ".cue");
  const audioFile = all_files.find((e) => e.extension === ".flac");
  const coverFile = all_files.find(
    (e) =>
      e.extension === ".png" ||
      e.extension === ".jpg" ||
      e.extension === ".jpeg"
  );

  if (cueFile === undefined) {
    console.log("File .cue not found.");
    return;
  }
  if (audioFile === undefined) {
    console.log("File .flac not found.");
    return;
  }
  if (coverFile === undefined) {
    console.log("File .png / .jpg / .jpeg not found.");
    return;
  }

  const total_metadata = await readCue({
    cueFilePath: cueFile.file_path,
    audioFilePath: audioFile.file_path,
  });

  for await (metadata of total_metadata.tracks) {
    const audioPath = await sliceAndTag({
      inputPath: audioFile.file_path,
      outputFolder: "test",
      metadata,
    });

    await tagCoverImage({
      imagePath: coverFile.file_path,
      audioPath: `../${audioPath}`,
    });
  }
})();
