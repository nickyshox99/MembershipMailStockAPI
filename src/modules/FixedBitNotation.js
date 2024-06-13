class FixedBitNotation {
    constructor(
      bitsPerCharacter,
      chars = null,
      rightPadFinalBits = false,
      padFinalGroup = false,
      padCharacter = '='
    ) {
      if (!chars || typeof chars !== 'string' || chars.length < 2) {
        chars =
          '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-,';
      }
  
      if (bitsPerCharacter < 1) {
        bitsPerCharacter = 1;
        var radix = 2;
      } else if (chars.length < 1 << bitsPerCharacter) {
        bitsPerCharacter = 1;
        var radix = 2;
        var shift = 1;
        while (chars.length >= (radix <<= 1) && bitsPerCharacter < 8) {
          bitsPerCharacter++;
        }
        radix >>= 1;
      } else if (bitsPerCharacter > 8) {
        bitsPerCharacter = 8;
        var radix = 256;
      } else {
        var radix = 1 << bitsPerCharacter;
      }
  
      this._chars = chars;
      this._bitsPerCharacter = bitsPerCharacter;
      this._radix = radix;
      this._rightPadFinalBits = rightPadFinalBits;
      this._padFinalGroup = padFinalGroup;
      this._padCharacter = padCharacter[0];
    }
  
    encode(rawString) {
      const bytes = Buffer.from(rawString);
      const byteCount = bytes.length;
  
      let encodedString = '';
      let byte = bytes[0];
      let bitsRead = 0;
  
      const chars = this._chars;
      const bitsPerCharacter = this._bitsPerCharacter;
      const rightPadFinalBits = this._rightPadFinalBits;
      const padFinalGroup = this._padFinalGroup;
      const padCharacter = this._padCharacter;
  
      for (let c = 0; c < (byteCount * 8) / bitsPerCharacter; c++) {
        if (bitsRead + bitsPerCharacter > 8) {
          const oldBitCount = 8 - bitsRead;
          const oldBits = byte ^ ((byte >> oldBitCount) << oldBitCount);
          const newBitCount = bitsPerCharacter - oldBitCount;
  
          if (c === Math.floor(byteCount * 8 / bitsPerCharacter) && rightPadFinalBits) {
            oldBits <<= newBitCount;
            encodedString += chars[oldBits];
  
            if (padFinalGroup) {
              const lcmMap = { 1: 1, 2: 1, 3: 3, 4: 1, 5: 5, 6: 3, 7: 7, 8: 1 };
              const bytesPerGroup = lcmMap[bitsPerCharacter];
              const pads = (bytesPerGroup * 8) / bitsPerCharacter - Math.ceil(
                (rawString.length % bytesPerGroup) * 8 / bitsPerCharacter
              );
              encodedString += padCharacter.repeat(pads);
            }
  
            break;
          }
  
          byte = bytes[c];
          bitsRead = 0;
        } else {
          oldBitCount = 0;
          newBitCount = bitsPerCharacter;
        }
  
        const bits = byte >> (8 - (bitsRead + newBitCount));
        const maskedBits = bits ^ (bits >> newBitCount << newBitCount);
        bitsRead += newBitCount;
  
        let combinedBits = maskedBits;
        if (oldBitCount) {
          combinedBits = (oldBits << newBitCount) | maskedBits;
        }
  
        encodedString += chars[combinedBits];
      }
  
      return encodedString;
    }
  
    decode(encodedString, caseSensitive = true, strict = false) {
      if (!encodedString || typeof encodedString !== 'string') {
        return '';
      }
  
      const chars = this._chars;
      const bitsPerCharacter = this._bitsPerCharacter;
      const radix = this._radix;
      const rightPadFinalBits = this._rightPadFinalBits;
      const padFinalGroup = this._padFinalGroup;
      const padCharacter = this._padCharacter;

      const charmap = {};
      for (let i = 0; i < radix; i++) {
        charmap[chars[i]] = i;
      }
     
      let lastNotatedIndex = encodedString.length - 1;
      while (encodedString[lastNotatedIndex] === padCharacter) {
        encodedString = encodedString.substring(0, lastNotatedIndex);
        lastNotatedIndex--;
      }
  
      let rawString = '';
      let byte = 0;
      let bitsWritten = 0;
  
      for (let c = 0; c <= lastNotatedIndex; c++) {
        const encodedChar = encodedString[c];
        let charIndex = charmap[encodedChar];
  
        if (!charIndex && !caseSensitive) {
          const cUpper = encodedChar.toUpperCase();
          const cLower = encodedChar.toLowerCase();
  
          if (charmap[cUpper]) {
            charIndex = charmap[cUpper];
            charmap[encodedChar] = charIndex;
          } else if (charmap[cLower]) {
            charIndex = charmap[cLower];
            charmap[encodedChar] = charIndex;
          }
        }

        if (charIndex !== undefined) {
          const bitsNeeded = 8 - bitsWritten;
          const unusedBitCount = bitsPerCharacter - bitsNeeded;
          
          let newBits;
          if (bitsNeeded > bitsPerCharacter) {            
            newBits = charIndex << (bitsNeeded - bitsPerCharacter);            
            bitsWritten += bitsPerCharacter;
          } else if (c !== lastNotatedIndex || rightPadFinalBits) {
            newBits = charIndex >> unusedBitCount;
            bitsWritten = 8;
          } else {
            newBits = charIndex;
            bitsWritten = 8;
          }
            
          byte |= newBits;
          
          if (bitsWritten === 8 || c === lastNotatedIndex) {
            // rawString += String.fromCharCode(byte);                        
            rawString += Buffer.from([byte]).toString('binary');

            if (c !== lastNotatedIndex) {
              bitsWritten = unusedBitCount;
              byte = (charIndex ^ (newBits << unusedBitCount)) << (8 - bitsWritten);
            }
          }
        } else if (strict) {
          return null;
        }
      }
  
      return rawString;
    }
  }
  
  
module.exports = FixedBitNotation;
  