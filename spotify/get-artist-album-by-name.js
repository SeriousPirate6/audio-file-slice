const { search } = require("./search");

module.exports = {
  getArtistAlbumByName: async ({ access_token, artist, album }) => {
    const albumArtistEncoded = encodeURIComponent(artist + album);
    const response = await search({
      access_token,
      query: albumArtistEncoded,
      type: "artist%2Calbum",
      limit: 1,
    });
    return response;
  },
};
