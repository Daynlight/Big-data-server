<div align=center>

# 🥮 Big Data Server 🥮

[![wakatime](https://wakatime.com/badge/user/233b40bd-5512-4e3e-9573-916f7b4127c3/project/2f8de718-e62f-4959-8961-0f7dbfe87e89.svg)](https://wakatime.com/badge/user/233b40bd-5512-4e3e-9573-916f7b4127c3/project/2f8de718-e62f-4959-8961-0f7dbfe87e89)
</div>



- [Usage](#usage)
  - [Run in Dev](#run-in-dev)
  - [Run in Production](#run-in-production)
  - [Set up keycloak](#set-up-keycloak)
- [Architecture](#architecture)
- [Backend apis](#backend-apis)
- [Application Actions](#application-actions)
  - [Register](#register)
  - [Login](#login)
  - [Upload](#upload)
  - [Download](#download)
  - [List](#list)
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
- postgresql keycloak port: 15432
- postgresql backend port: 15433

### Run in Production
    ```bash
    sudo env POSTGRES_KEYCLOAK_USER=keycloak \
         POSTGRES_KEYCLOAK_PASSWORD=keycloak \
         KEYCLOAK_ADMIN=keycloak \
         KEYCLOAK_ADMIN_PASSWORD=keycloak \
         POSTGRES_BACKEND_USER=admin \
         POSTGRES_BACKEND_PASSWORD=admin \
         KEYCLOAK_URL="localhost:9090" \
         KEYCLOAK_PROTOCOL="http" \
         KEYCLOAK_PORT=9090 \
         BACKEND_URL="localhost:8080" \
         BACKEND_PORT=8080 \
         FRONTEND_PORT=80 \
         BACKEND_PROTOCOL="http" \
         docker compose -f docker-compose.yml --project-name big-data-server up --build -d
    ```
- frontend port: FRONTEND_PORT
- backend port: BACKEND_PORT
- backend url: BACKEND_URL
- keycloak url: KEYCLOAK_URL
- keycloak port: KEYCLOAK_PORT
- postgresql port: NONE

### Set up keycloak
1. Add new realm with name ```Big-data-server-users```.
2. Allow self registration and email as username.
3. Add Client ```frontend``` for Vue.js.



## Architecture
- Project uses ```docker``` and ```docker-compose``` with two modes **production** and **development**.
- In **development** all links and ports are ```hardcoded``` and uses ```Dockerfile.dev``` for build. Also allows hot reload when project changes and runs containers in **dev** mode.
- In **production** all links and ports are passed via ```env``` and uses ```Dockerfile``` for build. Runs containers in **production** mode.
- For **user authentication** project uses ```keycloak```.
- ```keyclaok``` is separated service independent from ```backend``` and ```frontend```.
- **development** and **production** are separated. One issue is that they uses the same ```keycloak``` server. Because of I can't send request to ```keycloak``` from ```backend```. In future I will fix it.
- ```Backend``` have postgresql database where we store ```users.email``` obtained from ```keycloak```, ```files``` and ```file-chunks```.
- ```Docker``` is automatically loading ```backend.sql``` on first initialization of container.
- For ```Backend``` we use ```nest.js```.
- For ```Frontend``` we use ```vue.js``` with ```routers``` to store it in web-browser.
- ```Backend``` uses ```typeorm``` for connection to database.
- ```JWT token``` from ```keycloak``` is verified every time when api call to backend.
- In database ```chunks``` are ```compressed```.
- Client for compression uses ```pako```.
- Data are send as **Buffer**.



## Backend apis
- ```/create``` - creates file for user.
- ```/verify_chunk``` - verify chunk stored in database and current one.
- ```/upload_chunk``` - uploading/updating chunk in database.
- ```/list``` - list all files in page.
- ```/download_chunk``` - downloads data chunk.



## Application Actions 
### Register
- User keycloak register form and jwt token.

### Login
- Uses keycloak login form and jwt token.

### Upload
- Client goes to ```NewFile``` tab and fills data.
- Client compress data via gzip.
- Client split file into chunks 10mb.
- Client creates sha-256 hashes for each chunk.
- Client send api request(```create```) to backend with [```filename```, ```chunks number```].
- Client send api request(```verify_chunk```) to backend with [```filename```, ```chunkid```, ```hash```] to verify stored data.
- If hashes are the same than skip.
- If doesn't exist or hashes are different than update.
- Client send api request(```upload_chunk```) to backend with [```filename```, ```chunkid```, ```hash```, ```data```].
- Backend ```generate hash for received data``` and compare it with obtained ```hash```.
- If hashes doesn't match than ```return -1``` and Client sends it again up to **10 times**.
- Backend stores it to postgresql via ```typeorm```.
- After successful upload client goes to **Home**. 

### Download
- Client clicks on **Download** for file.
- Client send api request(```verify_download_chunk```) to backend with [```idf```, ```chunkid```, ```hash```] to check if they are different.
- If they are the same then skip download.
- Else update them.
- Client send api request(```download_chunk```) to backend with [```idf```, ```chunkid```].
- **Generates hash for obtained data** and **compare** it with **obtained hash**.
- If hashes are different than retry up to **10 times**.
- Client **stores data chunks**.
- Client **merge chunks**.
- Client ```decompress``` data.
- Client saves file into **download folder**.

### List
- Client loads **Home** page.
- Client automatically send api request(```list```) to backend with [```page```].
- Client gets page and render it in **Home** page.

### Update
In future...

### Remove
In future...

### Search
In future...



## TODO:
- [ ] keycloak dev mode.



## Kittie
<img width="100%" src="https://i.pinimg.com/1200x/e0/bb/de/e0bbdeccd25e517923c2924dd169aec0.jpg">


