const axios = require("axios");
const { SPOTIFY_API_URL } = require("../constants/constants");

module.exports = {
  search: async ({ access_token, query, type, limit = 1 }) => {
    return new Promise((resolve, reject) => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${SPOTIFY_API_URL}/search?q=${query}&type=${type}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  },
};
