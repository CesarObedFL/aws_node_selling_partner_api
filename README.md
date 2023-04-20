# aws node selling partner api

This api let you connect to the Amazon SP API using their SDK...


## _Features_

- It is in charge of connecting to the amazon api, seller partner api
- Through the SDK manages the client and the corresponding credentials for the connection to amazon
- Use [express] as http client
- You can use in production [PM2] as process daemon to linux servers


## _Dependencies_

- [amazon-sp-api]  "^0.7.4", [repository] docs npm : [npm-amazon-sp-api]
- [express]  "^4.18.0"


## _Requirements_

- npm ^8.3.1
- node ^16.13.2


## _Installation_

```
npm install 
```


[amazon-sp-api]: <https://developer-docs.amazon.com/sp-api/docs/what-is-the-selling-partner-api>
[npm-amazon-sp-api]: <https://www.npmjs.com/package/amazon-sp-api#call-the-api>
[repository]: <https://github.com/amzn/selling-partner-api-docs/tree/main/references>
[express]: <https://expressjs.com/es/>
[PM2]: <https://pm2.keymetrics.io/>