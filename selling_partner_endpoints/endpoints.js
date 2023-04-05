require('dotenv').config();
const express = require('express');

const SellingPartnerAPI = require('amazon-sp-api');
const routes = express();

let selling_partner_api = new SellingPartnerAPI( // Dreamlab
{
    region:'',
    refresh_token: '',
    access_token: '',
    role_credentials:{
        id: process.env.ROLE_ID,
        secret: process.env.ROLE_SECRET,
        security_token: process.env.ROLE_SECURITY_TOKEN
    },
    endpoints_versions:{
        
    },
    credentials:{
        SELLING_PARTNER_APP_CLIENT_ID: process.env.APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID, // credenciales del usuario iam en aws
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
    },
    options:{
      credentials_path:'~/.amzspapi/credentials',
      auto_request_tokens:true,
      auto_request_throttled:true,
      version_fallback:true,
      use_sandbox:false,
      only_grantless_operations:false,
      user_agent:"amazon-sp-api/<CLIENT_VERSION> (Language=Node.js/<NODE_VERSION>; Platform=<OS_PLATFORM>/<OS_RELEASE>)"
    }
}
);