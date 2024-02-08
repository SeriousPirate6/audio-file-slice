const fs = require("fs");
require("dotenv").config();
const path = require("path");
const { readCue } = require("./read-cue");
const { tagCoverImage } = require("./tag-cover");
const constants = require("./constants/constants");
const { sliceAndTag } = require("./slice-and-tag");
const { stringSanitizer } = require("./utils/string");
const { convertToFlac } = require("./convert-to-flac");
const { renameFolder, moveFile } = require("./utils/files");
const { isFlacFileByHeader } = require("./check-flac-file");
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

      let outputPath = path.dirname(folder_path);

      for await (track of audioFiles) {
        let filePath = track.file_path;

        if (!isFlacFileByHeader(track.file_path)) {
          console.log(
            `Detected audio file: ${track.file_extension}.\nConverting it to FLAC...`
          );
          filePath = await convertToFlac({
            fileInput: track.file_path,
            fileOutput: path.join(track.folder_path, `${track.file_name}.flac`),
          });
        }

        const full_metadata = await readCue({
          cueFilePath: cueFile.file_path,
          audioFile: track,
        });

        if (!full_metadata) continue;

        // TODO extract to an external function create subfolder logic;
        // create a new "lighter" version of read cue that fetches only the album's property;

        // fetching general album's metatada from the first track
        const tech_data = full_metadata.tracks[0].technical_info;

        const sub_folder = stringSanitizer(
          `${full_metadata.artist} - ${full_metadata.album} (${
            full_metadata.year
          }) [${tech_data.bits_per_raw_sample}bits-${Math.floor(
            tech_data.sample_rate / 1000
          )}kHz] ${tech_data.codec_name.toUpperCase()}`
        );

        outputPath += `/${sub_folder}`; // using the subfolder's path as output

        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath);
        }

        for await (metadata of full_metadata.tracks) {
          const audioPath = await sliceAndTag({
            inputPath: filePath,
            outputPath,
            metadata,
          });

          await tagCoverImage({ coverImage, audioPath });
        }
      }

      // moving the cover image to the new directory
      await moveFile({
        oldPath: coverImage,
        newPath: `${outputPath}/folder.jpeg`,
      });

      return;
    }
  }

  console.log(constants.INVALID_COMMAND);
  return;
})();
