<div align=center>

# 🥮 Big Data Server 🥮

</div>



- [Usage](#usage)
  - [Run in Dev](#run-in-dev)
  - [Run in Production](#run-in-production)
- [Architecture](#architecture)
  - [Register](#register)
  - [Login](#login)
  - [Upload](#upload)
  - [Download](#download)
  - [Update](#update)
  - [Remove](#remove)
  - [Search](#search)
- [TODO:](#todo)
- [Kittie](#kittie)



## Usage
### Run in Dev
    ```bash
    sudo docker compose -f docker-compose-dev.yml --project-name big-data-server-dev up --build
    ```
- frontend port: 10000
- backend port: 18080
- keycloak port: 19090
- postgresql port: 15432

### Run in Production
    ```bash
    sudo env POSTGRES_KEYCLOAK_USER=keycloak \
         POSTGRES_KEYCLOAK_PASSWORD=keycloak \
         KEYCLOAK_ADMIN=keycloak \
         KEYCLOAK_ADMIN_PASSWORD=keycloak \
         KEYCLOAK_URL="http://localhost:9090" \
         KEYCLOAK_PORT=9090 \
         BACKEND_URL="http://localhost:8080" \
         BACKEND_PORT=8080 \
         FRONTEND_PORT=80 \
         docker compose -f docker-compose.yml --project-name big-data-server up --build -d
    ```
- frontend port: FRONTEND_PORT
- backend port: BACKEND_PORT
- backend url: BACKEND_URL
- keycloak url: KEYCLOAK_URL
- keycloak port: KEYCLOAK_PORT
- postgresql port: NONE



## Architecture
### Register
- User send api request to backend:
  - Req:
    - username.
    - hashed password.
    * Backend create user in default realm.
  - Res:
    - Registration status.

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

### Search
In future...



## TODO:
- [ ] Zbuduj i uruchom usługę WWW (API + prosty klient), która umożliwia wysyłanie i pobieranie dużych plików w sposób odporny na problemy sieciowe (zerwane połączenia, ponowienia żądań).
- [ ] Upload w częściach (chunked upload) – klient dzieli plik na fragmenty i wysyła je osobno.
- [ ] Wznawianie uploadu – po przerwaniu transferu da się go kontynuować bez wysyłania wszystkiego od nowa.
- [ ] Integralność – fragmenty i/lub cały plik są weryfikowane checksumą (np. SHA-256); serwer odrzuca błędne dane.
- [ ] Pobieranie z wznawianiem – wsparcie dla Range (lub równoważny mechanizm).
- [ ] Minimalny klient (CLI lub skrypt), który potrafi wykonać upload i wznowienie.



## Kittie
<img width="100%" src="https://i.pinimg.com/1200x/e0/bb/de/e0bbdeccd25e517923c2924dd169aec0.jpg">
