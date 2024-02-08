const cueParser = require("../cue-parser/cue");
const { metadataFromTrack } = require("../metadata-from-track");
const { getSpotifyAccessToken } = require("./get-access-token");
const { getArtistAlbumByName } = require("./get-artist-album-by-name");

module.exports = {
  getImageFromTrack: async ({ filePath, cueFilePath }) => {
    /* fetching the metadata of the track */
    const metadata = await metadataFromTrack(filePath);

    let {
      [Object.keys(metadata).find((key) => key.toLowerCase() === "artist")]:
        artist,
      [Object.keys(metadata).find((key) => key.toLowerCase() === "album")]:
        album,
    } = metadata ?? {};

    if (!album || !artist) {
      if (!cueFilePath) {
        console.log("The track does not contains sufficient metadata.");
        return;
      }

      /* reading album and artist from .cue file, if provided */
      const cueData = cueParser.parse(cueFilePath);
      album = cueData.title;
      artist = cueData.performer;
    }

    /* requesting Spotify access token */
    const access_token = await getSpotifyAccessToken();

    /* fetching Spotify API for album and artists of the track */
    const response = await getArtistAlbumByName({
      access_token,
      album,
      artist,
    });

    /* returning the url of the cover image of the album */
    return response?.albums?.items[0].images[0].url;
  },
};
