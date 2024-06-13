const crypto = require('crypto');
const axios = require('axios');


class LineLoginLib 
{
    constructor(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL) 
    {
      this._CLIENT_ID = CLIENT_ID;
      this._CLIENT_SECRET = CLIENT_SECRET;
      this._CALLBACK_URL = CALLBACK_URL;
      this._STATE_KEY = 'random_state_str';
    }
  
    redirect(url) 
    {
      if (!res.headersSent) {
        res.setHeader('Location', url);
        res.statusCode = 302;
        res.end();
      } else {
        console.log(`<meta http-equiv="refresh" content="0;URL=${url}">`);
      }
    }
  
    authorize(stateKey) 
    {
      try 
      {
        // Your authorization logic here      
        const queryParams = new URLSearchParams({
          response_type: 'code',
          client_id: this._CLIENT_ID,
          redirect_uri: this._CALLBACK_URL,
          scope: 'openid profile',
          state: stateKey
        });
        const url = `https://access.line.me/oauth2/v2.1/authorize?${queryParams}`;  
        return url;
      } 
      catch (error) 
      {
        console.log(error);
        return "";
      }
      

    }

    async requestAccessToken(params, returnResult = null) {
      try {
        const code = params.code;
        const tokenURL = "https://api.line.me/oauth2/v2.1/token";
  
        const data = new URLSearchParams();
        data.append('grant_type', 'authorization_code');
        data.append('code', code);
        data.append('redirect_uri', this._CALLBACK_URL);
        data.append('client_id', this._CLIENT_ID);
        data.append('client_secret', this._CLIENT_SECRET);
  
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
  
        const response = await axios.post(tokenURL, data.toString(), config);
        const parsedResult = response.data;
  
        if (response.status === 200) {
          if (parsedResult && parsedResult.access_token) {
            if (returnResult === null) {
              return parsedResult.access_token;
            } else {
              if (parsedResult.id_token) {
                const userData = parsedResult.id_token.split('.');
                const [alg, data] = userData.map((item) =>
                  Buffer.from(item, 'base64').toString('binary')
                );
                parsedResult.alg = alg;
                parsedResult.user = data;
              }
              return parsedResult;
            }
          } else {
            return null;
          }
        } else {
          if (returnResult === null) {
            return null;
          } else {
            return parsedResult;
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async userProfile(accessToken, returnResult = null, ssl = null) {
      try {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const accToken = accessToken;
        const profileURL = "https://api.line.me/v2/profile";
  
        const headers = {
          'Authorization': `Bearer ${accToken}`
        };
  
        const config = {
          headers,
        };
  
        return axios.get(profileURL, config)
          .then((response) => {
            const parsedResult = response.data;
  
            if (response.status === 200) {
              if (parsedResult && parsedResult.userId) {
                if (returnResult === null) {
                  return parsedResult.userId;
                } else {
                  return parsedResult;
                }
              } else {
                return null;
              }
            } else {
              if (returnResult === null) {
                return null;
              } else {
                return parsedResult;
              }
            }
          })
          .catch((error) => {
            console.error(error);
            return null;
          });
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async verifyToken(accessToken, returnResult = null, ssl = null) {
      try {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const accToken = accessToken;
        const verifyURL = "https://api.line.me/oauth2/v2.1/verify";
  
        const data = {
          'access_token': accToken
        };
  
        const params = new URLSearchParams(data).toString();
  
        const options = {
          method: 'GET',
          url: `${verifyURL}?${params}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
  
        return axios(options)
          .then((response) => {
            const parsedResult = response.data;
  
            if (response.status === 200) {
              if (parsedResult && parsedResult.scope) {
                if (returnResult === null) {
                  return parsedResult.scope;
                } else {
                  return parsedResult;
                }
              } else {
                return null;
              }
            } else {
              if (returnResult === null) {
                return null;
              } else {
                return parsedResult;
              }
            }
          })
          .catch((error) => {
            console.error(error);
            return null;
          });
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async refreshToken(refreshToken, returnResult = null, ssl = null) {
      try {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const tokenURL = "https://api.line.me/oauth2/v2.1/token";
  
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
  
        const requestBody = new URLSearchParams();
        requestBody.append('grant_type', 'refresh_token');
        requestBody.append('refresh_token', refreshToken);
        requestBody.append('client_id', this._CLIENT_ID);
        requestBody.append('client_secret', this._CLIENT_SECRET);
  
        const config = {
          headers,
        };
  
        return axios.post(tokenURL, requestBody.toString(), config)
          .then((response) => {
            const parsedResult = response.data;
  
            if (response.status === 200) {
              if (parsedResult && parsedResult.access_token) {
                if (returnResult === null) {
                  return parsedResult.access_token;
                } else {
                  return parsedResult;
                }
              } else {
                return null;
              }
            } else {
              if (returnResult === null) {
                return null;
              } else {
                return parsedResult;
              }
            }
          })
          .catch((error) => {
            console.error(error);
            return null;
          });
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    async revokeToken(accessToken, returnResult = null, ssl = null) {
      try {
        const SSL_VERIFYHOST = ssl ? 2 : 0;
        const SSL_VERIFYPEER = ssl ? 1 : 0;
        const accToken = accessToken;
        const revokeURL = "https://api.line.me/oauth2/v2.1/revoke";
  
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
  
        const requestBody = new URLSearchParams();
        requestBody.append('access_token', accToken);
        requestBody.append('client_id', this._CLIENT_ID);
        requestBody.append('client_secret', this._CLIENT_SECRET);
  
        const config = {
          headers,
        };
  
        return axios.post(revokeURL, requestBody.toString(), config)
          .then((response) => {
            const httpCode = response.status;
            if (httpCode === 200) {
              return true;
            } else {
              return null;
            }
          })
          .catch((error) => {
            console.error(error);
            return null;
          });
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    setStateKey(stateKey) 
    {
        this._STATE_KEY = stateKey;
    }

    randomToken(length = 32) 
    {
        if (!length || parseInt(length) <= 8) {
          length = 32;
        }
    
        if (crypto.randomBytes) {
          return crypto.randomBytes(length).toString('hex');
        }
    
        if (crypto.pseudoRandomBytes) {
          return crypto.pseudoRandomBytes(length).toString('hex');
        }
    
        throw new Error('No suitable cryptographic function available.');
    }
}
  
module.exports = LineLoginLib;