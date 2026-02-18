<div align=center>

# Big Data Server

</div>


Wymagania:

- [ ] Zbuduj i uruchom usługę WWW (API + prosty klient), która umożliwia wysyłanie i pobieranie dużych plików w sposób odporny na problemy sieciowe (zerwane połączenia, ponowienia żądań).
- [ ] Upload w częściach (chunked upload) – klient dzieli plik na fragmenty i wysyła je osobno.
- [ ] Wznawianie uploadu – po przerwaniu transferu da się go kontynuować bez wysyłania wszystkiego od nowa.
- [ ] Integralność – fragmenty i/lub cały plik są weryfikowane checksumą (np. SHA-256); serwer odrzuca błędne dane.
- [ ] Pobieranie z wznawianiem – wsparcie dla Range (lub równoważny mechanizm).
- [ ] Minimalny klient (CLI lub skrypt), który potrafi wykonać upload i wznowienie.





## Architecture
### Login
- User send api request with login and hashed password to Keycloak and obtain JWT.
- Api is send via cloudflare tunnel that provides https and TLS.
- On server every request is validate with JWT token.
- Default user is in User Realm.

### Upload
- Client send request to start uploading file with:
  - Req:
    - JWT token.
    - Filename.
    - Chunk size.
    - Public/Private.
    * Backend creates filename for user. 
  - Res:
    - File state (ready for upload, already exist).
    - Chunk size.
    - Token for upload that is connected with specific file and user.

- Client separate file to chunks base on chunk size.
- For each chunk base on chunk size:
  - Create gzip for chunk.
  - Client create gzip hash.

  - Send request to validate chunk:
    - Req:
      - JWT
      - upload token.
      - chunk id.
      - hash.
    - Res:
      - Chunk state.

  - if Chunk state not the same -> Send data with:
    - Req:
      - JWT.
      - upload token.
      - gzip.
      - chunk id.
      * Backend save gzip, chunk id, gzip hash.
    - Res:
      - gzip hash.
    
    - Client repeat loop again. 

  - if Chunk state the same goes to next one.

- Client send request with end of upload:
  - Req:
    - JWT.
    - Upload token.
    * Remove upload token and save file state in db.
  - Res:
    - Upload state.  

### Download
- Client send request to start downloading.
  - Req:
    - JWT.
    - Username (Owner).
    - Filename.
  - Res:
    - File state (exist, not exist).
    - Chunk size.
    - Token for downloading that is connected with specific user, file and user that download content.

- For each chunk base on chunk size:
  - Send request for chunk:
    - Req:
      - JWT.
      - Token to download.
      - Chunk id.
    - Res:
      - gzip data.
      - gzip hash.
  
  - if hashes are the same:
    - Un zip.
    - Go to next chunk. 
  - if hashes are not the same:
    - Repeat download.

- Client send end of download:
  - Req:
    - JWT.
    - Download token.
    * Backend removes download token.
  - Res:
    - Download state.

### Update
In future...

### Remove
In future...