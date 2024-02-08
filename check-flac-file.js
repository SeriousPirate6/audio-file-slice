const fs = require("fs");

module.exports = {
  isFlacFileByHeader: (filePath) => {
    const flacHeader = Buffer.from([0x66, 0x4c, 0x61, 0x43]); // "fLaC" in hexadecimal
    const headerBuffer = Buffer.alloc(flacHeader.length);

    try {
      const fileDescriptor = fs.openSync(filePath, "r");
      fs.readSync(fileDescriptor, headerBuffer, 0, flacHeader.length, 0);
      fs.closeSync(fileDescriptor);

      return headerBuffer.equals(flacHeader);
    } catch (error) {
      console.error("Error reading file header:", error);
      return false;
    }
  },
};
