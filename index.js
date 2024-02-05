require("dotenv").config();
const path = require("path");
const { readCue } = require("./read-cue");
const { tagCoverImage } = require("./tag-cover");
const constants = require("./constants/constants");
const { sliceAndTag } = require("./slice-and-tag");
const { renameFolder } = require("./utils/rename-folder");
const { searchTracksAndCover } = require("./search-files-and-tag");

(async () => {
  const command = process.argv[2].toLowerCase();
  const folder_path = process.argv[3];

  switch (command) {
    case constants.COMMAND_HELP: {
      console.log(constants.HELP);
      return;
    }

    case constants.COMMAND_COVER: {
      const { audioFiles, coverImage } = await searchTracksAndCover(
        folder_path
      );

      // if audio files not available the whole object hasn't been returned
      if (!audioFiles) {
        console.log("Audio files not found.");
      }

      for await (track of audioFiles) {
        await tagCoverImage({ coverImage, audioPath: track.file_path });
      }

      // renaming the folder to force the player to reload it
      await renameFolder({ oldPath: folder_path, newPath: folder_path + "-" });

      return;
    }

    case constants.COMMAND_SLICE_TAG_COVER: {
      const { cueFile, audioFiles, coverImage } = await searchTracksAndCover(
        folder_path
      );

      // if audio files not available the whole object hasn't been returned
      if (!audioFiles) {
        console.log("Audio files not found.");
      }

      if (cueFile === undefined) {
        console.log("File .cue not found.");
        return;
      }

      const total_metadata = await readCue({
        cueFilePath: cueFile.file_path,
        audioFilePath: audioFiles.file_path,
      });

      for await (metadata of total_metadata.tracks) {
        const audioPath = await sliceAndTag({
          inputPath: audioFiles.file_path,
          outputFolder: path.dirname(folder_path), // using the subfolder's path as output
          metadata,
        });

        await tagCoverImage({ coverImage, audioPath });
      }

      // renaming the folder to force the player to reload it
      await renameFolder({ oldPath: folder_path, newPath: folder_path + "-" });

      return;
    }
  }

  console.log(constants.INVALID_COMMAND);
  return;
})();
