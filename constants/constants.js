module.exports = Object.freeze({
  // COMMANDS
  COMMAND_HELP: "-h",
  COMMAND_COVER: "-c",
  COMMAND_SLICE_TAG_COVER: "-s",

  // CUE PARAMS
  DATE: "DATE",
  GENRE: "GENRE",

  // DIRECTORIES
  META_FLAC_DIR: "meta-flac",

  // OUTPUTS
  HELP: `\n- SYNTAX -\n
      slice, tag, cover image:  -s "C:\\YourFolder"\n
        ("YourFolder" must contains:
          1x .flac file;
          1x .cue file;
          1x .jpg / .jpeg / .png file
            (the name must be one of the following: "album", "cover", "folder", "front").\n\n
      adding cover image only:  -c "C:\\YourFolder"\n
        ("YourFolder" must contains:
          Nx .flac file(s);
          1x .jpg / .jpeg / .png file
            (the name must be one of the following: "album", "cover", "folder", "front").
      \n`,
  INVALID_COMMAND: "Command provided not valid. Use -h for help.",

  // URLS
  SPOTIFY_API_URL: "https://api.spotify.com/v1",
  SPOTIFY_AUTHENTICATION_URL: "https://accounts.spotify.com/api/token",
});
