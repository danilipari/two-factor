import speakeasy from 'speakeasy';
import base32 from 'thirty-two';
import qrcode from 'qrcode';
import fs from 'fs';
import { exec } from 'child_process';
import { Totp } from "time2fa";

const qrcodeGen = false;
const logs = !false;

/**
 * Genera una chiave segreta utilizzando la libreria `speakeasy`.
 * @author [Dani Lipari](https://github.com/danilipari)
 * @returns {object} Un oggetto che rappresenta la chiave segreta generata.
 */
const keyGen = 'LNXWE2TFMN2CAT3CNJSWG5C5'; // speakeasy.generateSecret();

/**
 * Codifica la chiave segreta in formato Base32 utilizzando la libreria `thirty-two`.
 * @author [Dani Lipari](https://github.com/danilipari)
 * @param {string} key - La chiave segreta da codificare.
 * @returns {string} La chiave segreta codificata in formato Base32.
 */
const secretBuffer = Buffer.from(keyGen, 'ascii');
const secretBase32 = base32.encode(secretBuffer).toString().replace(/=/g, '');

/**
 * Oggetto che rappresenta l'account per l'autenticazione a due fattori.
 * @author [Dani Lipari](https://github.com/danilipari)
 * @property {string} init - L'iniziale dell'account.
 * @property {string} secret - La chiave segreta codificata in formato Base32.
 * @property {string} encoding - Il tipo di codifica utilizzato per la chiave segreta.
 * @property {number} period - Il periodo in secondi per la generazione dei codici OTP.
 * @property {number} digits - Il numero di cifre per i codici OTP generati.
 * @property {string} algorithm - L'algoritmo utilizzato per la generazione dei codici OTP.
 * @property {string} issuer - Il nome dell'emittente del codice OTP.
 * @property {number} window - La finestra di verifica per i codici OTP.
 */
const account = {
  init: 'd.lipari',
  secret: secretBase32,
  encoding: 'base32',
  period: 30,
  digits: 6,
  algorithm: 'SHA1',
  issuer: 'Service',
  window: 0,
};

/**
 * Genera l'URL per la configurazione del codice OTP utilizzando i parametri dell'account.
 * @author [Dani Lipari](https://github.com/danilipari)
 * @returns {string} L'URL per la configurazione del codice OTP.
 */
const otpURL = `otpauth://totp/${encodeURIComponent(
  account.init
)}?secret=${encodeURIComponent(secretBase32)}&issuer=${encodeURIComponent(
  account.issuer
)}&algorithm=${encodeURIComponent(
  account.algorithm
)}&digits=${encodeURIComponent(account.digits)}&period=${encodeURIComponent(
  account.period
)}`;

logs && console.log('account --> ', '\n', account, '\n', otpURL, '\n');

/**
 * Genera il codice QR (se abilitato) e lo salva in un file HTML.
 * @author [Dani Lipari](https://github.com/danilipari)
 * @param {boolean} qrcodeGen - Flag che indica se generare il codice QR.
 */
qrcodeGen &&
  qrcode.toDataURL(otpURL, { errorCorrectionLevel: 'L' }, function (err, url) {
    if (err) {
      console.error(err);
      return;
    } else {
      logs && console.log('QR code URL --> ', url);

      const htmlContentInit = `<!DOCTYPE html><html><body></body></html>`;
      const tempFilePath = 'qrcode.html';
      let htmlContent = htmlContentInit;
      writeFile(tempFilePath, htmlContent);

      setTimeout(() => {
        exec(`open ${tempFilePath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            htmlContent = htmlContentInit;
            writeFile(tempFilePath, htmlContent);
          } else {
            htmlContent = `<!DOCTYPE html><html><body><img src="${url}" /></body></html>`;
            writeFile(tempFilePath, htmlContent);
          }
        });
      }, 500);
    }
  });

/**
 * Verifica se un codice OTP è valido utilizzando i parametri dell'account.
 * @author [Dani Lipari](https://github.com/danilipari)
 * @param {string} token - Il codice OTP da verificare.
 * @returns {boolean} True se il codice OTP è valido, false altrimenti.
 */
const isValid = speakeasy.totp.verify({
  secret: account.secret,
  encoding: account.encoding,
  algorithm: account.algorithm,
  digits: account.digits,
  period: account.period,
  token: '000000',
  window: account.window,
});

if (!qrcodeGen) {
  if (isValid) {
    logs && console.log('Il codice OTP è valido!');
    !logs && console.log(200);
  } else {
    logs && console.log('Il codice OTP non è valido!');
    !logs && console.log(401);
  }
} else {
  console.log('QRCode generated!');
}

/**
 * Funzione di utilità per scrivere un file.
 * @author [Dani Lipari](https://github.com/danilipari)
 * @param {string} filePath - Il percorso del file da scrivere.
 * @param {string} html - Il contenuto HTML da scrivere nel file.
 */
const writeFile = (filePath, html) => {
  fs.writeFileSync(filePath, html);
};
