const FixedBitNotation = require('./FixedBitNotation');

class GoogleAuthenticator {
  static PASS_CODE_LENGTH = 6;
  static PIN_MODULO;
  static SECRET_LENGTH = 10;

  constructor() {
    GoogleAuthenticator.PIN_MODULO = Math.pow(10, GoogleAuthenticator.PASS_CODE_LENGTH);
  }

  async checkCode(secret, code) {
    const time = Math.floor(Date.now() / 1000 / 30);
    for (let i = -1; i <= 1; i++) {
      console.log(time+i);
      const tmpCode = await this.getCode(secret, time + i);            
      console.log(tmpCode,' ',code);
      if (tmpCode === code) {
        return true;
      }
    }
    return false;
  }

  async getCode(secret, time = null) {
    
    if (!time) {
      time = Math.floor(Date.now() / 1000 / 30);
    }
    const base32 = new FixedBitNotation(5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', true, true);
    // console.log(base32);
    secret = base32.decode(secret);

    let buffer = Buffer.alloc(4); // Create a new buffer of 4 bytes (equivalent to 32 bits)
    buffer.writeUInt32BE(time); // Write the unsigned 32-bit integer in big-endian format
    let paddedBuffer = Buffer.alloc(8); // Create a new buffer of 8 bytes (equivalent to 64 bits)
    buffer.copy(paddedBuffer, 8 - buffer.length); // Copy the original buffer into the padded buffer, aligning it to the left

    const crypto = require('crypto');    
    let hash = crypto.createHmac('sha1', secret).update(paddedBuffer).digest('hex');

    let offset = hash.charCodeAt(hash.length - 1);
    
    offset = offset & 0xF;    
    
    const truncatedHash = await this.hashToInt(hash, offset) & 0x7fffffff;
    const pinValue = truncatedHash % GoogleAuthenticator.PIN_MODULO;    
    return pinValue.toString().padStart(6, '0');
  }

  async hashToInt(bytes, start) {
    
    let input = bytes.slice(start);        
    console.log(input);
    let val2 = Buffer.from(input.slice(0, 4)).readUInt32BE();    
    return val2;
  }

  async getUrl(user, hostname, secret) {
    const url = `otpauth://totp/${user}@${hostname}?secret=${secret}`;
    const encoder = 'https://www.google.com/chart?chs=200x200&chld=M|0&cht=qr&chl=';
    const encoderURL = `${encoder}otpauth://totp/${user}@${hostname}&secret=${secret}`;
    return encoderURL;
  }

  async generateSecret() {
    let secret = '';
    for (let i = 1; i <= GoogleAuthenticator.SECRET_LENGTH; i++) {
      const c = Math.floor(Math.random() * 256);
      secret += String.fromCharCode(c);
    }
    const base32 = new FixedBitNotation(5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', true, true);
    return base32.encode(secret);
  }
}

module.exports = GoogleAuthenticator;
