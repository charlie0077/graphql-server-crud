Please go to [https://nostalgic-perlman-fe9f48.netlify.com](https://nostalgic-perlman-fe9f48.netlify.com/example/) for the complete documentation.

# Steps:

## 1. launch database
```sh
cd example/database
docker-compose up
```

## 2. run grapqhql api server
```sh
cd example
npm install
npm run seed # this will seed the data
npm start
```
Note: This example code requires Node.js >= 12.


## 3. go to browser http://localhost:4000/
