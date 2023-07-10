# Two-factor authentication

```md
Support Google Authenticator!
```

---

Questo progetto implementa l'autenticazione a due fattori utilizzando il codice OTP (One-Time Password) generato tramite l'applicazione `speakeasy`.

## Dipendenze

Assicurati di avere le seguenti dipendenze installate nel tuo ambiente di sviluppo:

- [Node.js](https://nodejs.org) (versione 16 o superiore)
- [npm](https://www.npmjs.com/) (gestore dei pacchetti di Node.js)

## Installazione

1. Clona il repository del progetto:

   ```shell
   git clone https://github.com/danilipari/two-factor.git
   ```

2. Entra nella directory del progetto:

   ```shell
   cd two-factor
   ```

3. Installa le dipendenze del progetto:

   ```shell
   npm install
   ```

## Configurazione

Prima di eseguire il progetto, è necessario configurare alcune variabili.

1. Apri il file `index.js` nel tuo editor di codice.

2. Modifica le seguenti variabili per adattarle alle tue esigenze:

   - `qrcodeGen`: Imposta il valore su `true` se desideri generare un codice QR per la configurazione del codice OTP, altrimenti impostalo su `false`.
   - `logs`: Imposta il valore su `true` se desideri abilitare i log durante l'esecuzione, altrimenti impostalo su `false`.
   - `account.init`: Inserisci l'iniziale dell'account desiderato.
   - `account.issuer`: Inserisci il nome dell'emittente del codice OTP desiderato.

## Utilizzo

Per avviare il progetto, esegui il seguente comando nella directory del progetto:

```shell
node index.js
```

Il programma genererà una chiave segreta utilizzando `speakeasy` e la codificherà in formato Base32 utilizzando `thirty-two`. Successivamente, verrà generato un URL per la configurazione del codice OTP. Se `qrcodeGen` è impostato su `true`, verrà generato un codice QR corrispondente all'URL e salvato in un file HTML chiamato `qrcode.html`. Infine, il programma verificherà se un codice OTP "000000" è valido utilizzando `speakeasy.totp.verify()`.

## Risorse aggiuntive

- [Documentazione di speakeasy](https://github.com/speakeasyjs/speakeasy)
- [Documentazione di thirty-two](https://github.com/ashtuchkin/thirty-two)
- [Documentazione di qrcode](https://github.com/soldair/node-qrcode)
- [Documentazione di Node.js File System](https://nodejs.org/api/fs.html)
- [Documentazione di child_process](https://nodejs.org/api/child_process.html)

## Contributi

Sono benvenuti i contributi al progetto! Se desideri apportare modifiche o segnalare problemi, puoi aprire una nuova issue o inviare una pull request.
