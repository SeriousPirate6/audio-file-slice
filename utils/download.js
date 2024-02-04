const fs = require("fs");
const https = require("https");

module.exports = {
  downloadImage: async ({ fileUrl, downloadPath }) => {
    return new Promise((resolve, reject) => {
      https
        .get(fileUrl, function (response) {
          const contentType = response.headers["content-type"];
          const fileExtention = contentType.split("/")[1];

          downloadPath += "/folder." + fileExtention;

          const file = fs.createWriteStream(downloadPath);

          response.pipe(file);

          file.on("finish", function () {
            file.close();
            console.log("File downloaded successfully.");
            resolve(downloadPath);
          });
        })
        .on("error", function (err) {
          fs.unlink(downloadPath);
          console.error("Error downloading file:", err.message);
          reject();
        });
    });
  },
};
