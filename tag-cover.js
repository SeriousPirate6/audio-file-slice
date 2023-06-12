const { exec } = require("child_process");
const constants = require("./constants/constants");

const audioPath = "../Bila.flac";
const imagePath = "C:\\Users\\Pirat\\Proj\\audio-file-slice\\cover.jpg";

const command = `metaflac --import-picture-from="${imagePath}" "${audioPath}"`;

exec(
  command,
  {
    cwd: constants.META_FLAC_DIR,
  },
  function (error) {
    if (error) {
      console.error("Failed to add thumbnail to the FLAC file:", error);
    } else {
      console.log("Thumbnail added to the FLAC file successfully.");
    }
  }
);
