const { metadataFromTrack } = require("../metadata-from-track");
const { getSpotifyAccessToken } = require("./get-access-token");
const { getArtistAlbumByName } = require("./get-artist-album-by-name");

module.exports = {
  getImageFromTrack: async (filePath) => {
    /* fetching the metadata of the track */
    const { ALBUM, ARTIST } = await metadataFromTrack(filePath);

    if (!ALBUM || !ARTIST) {
      console.log("The track does not contains sufficient metadata.");
      return;
    }

    /* requesting Spotify access token */
    const access_token = await getSpotifyAccessToken();

    /* fetching Spotify API for album and artists of the track */
    const response = await getArtistAlbumByName({
      access_token,
      album: ALBUM,
      artist: ARTIST,
    });

    /* returning the url of the cover image of the album */
    return response?.albums?.items[0].images[0].url;
  },
};
