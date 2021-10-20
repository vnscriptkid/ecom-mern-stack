## Mongodb
#### mongoimport
https://docs.mongodb.com/database-tools/mongoimport/#installation
```console
mongoimport --uri "mongodb://localhost:27017/react-reserve" --type=json --file="./static/products.json" --jsonArray
```

## Common errors
#### oops
```json
Error: connect ECONNREFUSED 127.0.0.1:80
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)
```
Fetching data on server (`getInitialProps`) should use absolute url