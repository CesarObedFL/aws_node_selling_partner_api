# aws node selling partner api

This api let you connect to the Amazon SP API using their SDK...

First of all following the [official-documentation]!!!...


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

# _.env file explanation_

Following the [official-documentation]!!!...

_You can get the followinf data on the Amazon [seller-central-portal]!..._
you need to be registered as a developer there, that process could take about two weeks...

- APP_ID=<YOUR_APP_ID> : Represents your application on the Amazon platform, example: amzn1.sp.solution....
- APP_REGION=<YOUR_APP_REGION> : Indicates the geographic region in which your application is authorized
- APP_CLIENT_ID=<YOUR_APP_CLIENT_ID> : Indicates the geographic region in which your application is authorized. This is a unique identifier that represents the application in the context of Login with Amazon (LWA). Also obtained when you register your application in the Amazon Developer Console. example: amzn1.application-oa2-client....
- APP_CLIENT_SECRET=<YOUR_APP_CLIENT_SECRET> : The client secret is a secret key that corresponds to the APP_CLIENT_ID
- APP_CLIENT_ACCESS_TOKEN=<LWA_ACCESS_TOKEN> : It is a token that represents your application's authorization to access the Seller Partner API
- APP_CLIENT_REFRESH_TOKEN=<LWA_REFRESH_TOKEN> : It is a token that is used to renew the client access token if it expires

This data is essential for the authentication and authorization of your application in the Amazon Seller Partner API through Login with Amazon (LWA). They establish the identity of your application and ensure that only authorized applications can access the API. Additionally, the access token and refresh token allow your application to securely access API resources and keep authentication active.



The following is data extracted from the IAM user created in AWS:

- AWS_ACCESS_KEY_ID=<YOUR_AWS_USER_ID>
- AWS_SECRET_ACCESS_KEY=<YOUR_AWS_USER_SECRET>
- AWS_SELLING_PARTNER_ROLE=<YOUR_AWS_SELLING_PARTNER_API_ROLE>

This data allows your application or system to securely authenticate and authorize itself to the Amazon Seller Partner API. The AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are used to authenticate requests, while the AWS_SELLING_PARTNER_ROLE determines what actions and resources can be accessed by the application or system in the API. This helps ensure that only authorized applications and systems have access to API resources.



The following is data extracted from the AssumeRole of AWS:

- ROLE_ID=<TEMPORARY_ROLE_ACCESS_ID>
- ROLE_SECRET=<TEMPORARY_ROLE_ACCESS_SECRET>
- ROLE_SECURITY_TOKEN=<TEMPORARY_ROLE_SECURITY_TOKEN>

This data is essential to establish a secure and authorized connection to the Amazon Seller Partner API when assuming a temporary role. The process involves authentication and authorization using the ROLE_ID, ROLE_SECRET, and ROLE_SECURITY_TOKEN, allowing your application or system to interact with the API on behalf of the configured temporary role.


## _Running the app_

development mode: `npm run serve`

production mode: you have to use [PM2] or a similar daemon package to run on background the app and use it
```
pm2 start index.js
```


[amazon-sp-api]: <https://developer-docs.amazon.com/sp-api/docs/what-is-the-selling-partner-api>
[npm-amazon-sp-api]: <https://www.npmjs.com/package/amazon-sp-api#call-the-api>
[seller-central-portal]: <https://sellercentral.amazon.com.mx/>
[official-documentation]: <https://developer.amazonservices.com/amazon-business>
[repository]: <https://github.com/amzn/selling-partner-api-docs/tree/main/references>
[express]: <https://expressjs.com/es/>
[PM2]: <https://pm2.keymetrics.io/>