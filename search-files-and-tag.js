const { downloadImage } = require("./utils/download");
const { listFilesRecursively } = require("./utils/files");
const { getImageFromTrack } = require("./spotify/get-image-from-response");

module.exports = {
  searchTracksAndCover: async (folder_path) => {
    const all_files = listFilesRecursively({ folder_path });

    const cueFile = all_files.find((e) => e.file_extension === ".cue");
    const audioFiles = all_files.filter(
      (e) =>
        e.file_extension === ".flac" ||
        e.file_extension === ".wav" ||
        e.file_extension === ".ape"
    );
    let coverImage = all_files.find(
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
      console.log("Audio files not found.");
      return;
    }
    if (coverImage === undefined) {
      console.log("Cover image not found, downloading it...");

      const imageUrl = await getImageFromTrack({
        filePath: audioFiles[0].file_path,
        cueFilePath: cueFile?.file_path,
      });

      if (!imageUrl) return;

      coverImage = await downloadImage({
        fileUrl: imageUrl,
        downloadPath: folder_path,
      });
    }

    return {
      cueFile,
      audioFiles,
      coverImage: coverImage.file_path ? coverImage.file_path : coverImage,
    };
  },
};
