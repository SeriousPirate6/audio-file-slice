const qs = require("qs");
const axios = require("axios");
const { SPOTIFY_AUTHENTICATION_URL } = require("../constants/constants");

module.exports = {
  getSpotifyAccessToken: async () => {
    return new Promise((resolve, reject) => {
      const data = qs.stringify({
        grant_type: "client_credentials",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: SPOTIFY_AUTHENTICATION_URL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          resolve(response.data?.access_token);
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  },
};
