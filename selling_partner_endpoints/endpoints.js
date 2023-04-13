require('dotenv').config();
const express = require('express');

const SellingPartnerAPI = require('amazon-sp-api');
const routes = express();

const marketplaceIds = [];

let selling_partner_api = new SellingPartnerAPI({
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
});

// get orders by a time interval 
routes.get('/spapi/orders', (request, response) => {
    let date_from = request.query.date_from;
    let date_to = request.query.date_to;
    console.log(date_from); console.log(date_to);
    var orders = [];
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                api_path:'/orders/v0/orders',
                method:'GET',
                query:{
                    MarketplaceIds: marketplaceIds,
                    CreatedAfter: date_from.toString(),
                    CreatedBefore: date_to.toString(),
                    version:'beta'
                }
            });
            orders.push(res.Orders);
            while(res.NextToken) {
                let nexttoken = res.NextToken;
                res = await selling_partner_api.callAPI({
                    api_path:'/orders/v0/orders',
                    method:'GET',
                    query:{
                        MarketplaceIds: marketplaceIds,
                        CreatedAfter: date_from.toString(),
                        CreatedBefore: date_to.toString(),
                        NextToken: nexttoken,
                        version:'beta'
                    }
                });
                orders.push(res.Orders);
            }
            response.json({ Orders : orders });
        } catch(e) {
            response.json(e);
        }
    })();
});


// get order by order_id
routes.get('/spapi/order/:id', (request, response) => {
    const {id} = request.params;
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                api_path:'/orders/v0/orders/'+[id],
                method:'GET',
                query:{
                    marketplaceIds: marketplaceIds,
                    version:'beta'
                }
            });
            response.json(res);
        } catch(e) {
            response.json(e);
        }
    })();
});

// get order items by order id
routes.get('/spapi/order/:id/items', (request, response) => {
    const {id} = request.params;
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                api_path:'/orders/v0/orders/'+[id]+'/orderItems',
                method:'GET',
                query:{
                    marketplaceIds: marketplaceIds,
                    version:'beta'
                }
            });
            response.json(res);
        } catch(e) {
            response.json(e);
        }
    })();
});

// endpoint to get the inventory
routes.get('/spapi/inventory', (request, response) => {
    (async() => {
        try {
            let inventory = [];
            let res = await selling_partner_api.callAPI({
                api_path:'/fba/inventory/v1/summaries',
                method:'GET',
                query:{
                    details: true,
                    granularityType: ['Marketplace'],
                    granularityId: 'A1AM78C64UM0Y8',
                    marketplaceIds: marketplaceIds,
                    version:'beta'
                }
            });
            inventory.push(res.inventorySummaries);
            while(res.nextToken) {
                let nexttoken = res.nextToken;
                console.log("NextToken: " + res.nextToken);
                res = await selling_partner_dreamlab.callAPI({
                    api_path:'/fba/inventory/v1/summaries',
                    method:'GET',
                    query:{
                        details: true,
                        granularityType: ['Marketplace'],
                        granularityId: 'A1AM78C64UM0Y8',
                        marketplaceIds: marketplaceIds,
                        nextToken: nexttoken,
                        version:'beta'
                    }
                });
                inventory.push(res.inventorySummaries);
            }
            response.json({ Inventory : inventory });
        } catch(e) {
            console.log(e);
            response.json(e);
        }
    })();
});
