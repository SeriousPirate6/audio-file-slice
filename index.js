const path = require("path");
const { readCue } = require("./read-cue");
const { sliceAndTag } = require("./slice-and-tag");
const { tagCoverImage } = require("./tag-cover");
const { listFilesRecursively } = require("./recursive-file-searching");
const constants = require("./constants/constants");

(async () => {
  const command = process.argv[2].toLowerCase();
  const folder_path = process.argv[3];

  switch (command) {
    case constants.COMMAND_HELP: {
      console.log(constants.HELP);
      return;
    }

    case constants.COMMAND_COVER: {
      const all_files = listFilesRecursively({ folder_path });

      const audioFiles = all_files.filter((e) => e.file_extension === ".flac");
      const coverFile = all_files.find(
        (e) =>
          (e.file_extension === ".png" ||
            e.file_extension === ".jpg" ||
            e.file_extension === ".jpeg") &&
          (e.file_name.toLowerCase() === "cover" ||
            e.file_name.toLowerCase() === "front" ||
            e.file_name.toLowerCase() === "folder" ||
            e.file_name.toLowerCase() === "album") &&
          e.file_layer === 0 // taking the file only if in the main folder
      );

      if (audioFiles === undefined) {
        console.log("Files .flac not found.");
        return;
      }
      if (coverFile === undefined) {
        console.log("File .png / .jpg / .jpeg not found.");
        return;
      }

      for await (track of audioFiles) {
        await tagCoverImage({
          imagePath: coverFile.file_path,
          audioPath: track.file_path,
        });
      }
      return;
    }

    // TODO possible future implementation:
    // searching for info and cover image of the album from an API service.

    case constants.COMMAND_SLICE_TAG_COVER: {
      const all_files = listFilesRecursively({ folder_path });

      const cueFile = all_files.find((e) => e.extension === ".cue");
      const audioFile = all_files.find((e) => e.extension === ".flac");
      const coverFile = all_files.find(
        (e) =>
          (e.file_extension === ".png" ||
            e.file_extension === ".jpg" ||
            e.file_extension === ".jpeg") &&
          (e.file_name === "cover" ||
            e.file_name === "front" ||
            e.file_name === "folder" ||
            e.file_name === "album") &&
          e.file_layer === 0
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
          outputFolder: path.dirname(folder_path), // using the subfolder's path as output
          metadata,
        });

        await tagCoverImage({
          imagePath: coverFile.file_path,
          audioPath,
        });
      }
      return;
    }
  }

  console.log(constants.INVALID_COMMAND);
  return;
})();
