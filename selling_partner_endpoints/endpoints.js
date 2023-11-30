require('dotenv').config();
const express = require('express');

const SellingPartnerAPI = require('amazon-sp-api');
const routes = express.Router();

// you should put your amazon marketplace ids in this array
const marketplaceIds = []; 

let selling_partner_api = new SellingPartnerAPI({
    region: process.env.APP_REGION,
    refresh_token: process.env.APP_CLIENT_REFRESH_TOKEN,
    access_token: process.env.APP_CLIENT_ACCESS_TOKEN,
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
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID, // credenciales del usuario iam en aws | aws iam user credentials
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
    },
    options:{
        credentials_path: '~/.amzspapi/credentials',
        auto_request_tokens: true,
        auto_request_throttled: true,
        version_fallback: true,
        use_sandbox: false,
        only_grantless_operations: false,
        user_agent: "amazon-sp-api/<CLIENT_VERSION> (Language=Node.js/<NODE_VERSION>; Platform=<OS_PLATFORM>/<OS_RELEASE>)"
    }
});

/**
 * endpoint to get orders by a time interval 
 * 
 * @param Date date_from 
 * @param Date date_to 
 * @return json object with the obtained orders or the sp-api error message
 */
routes.get('/spapi/orders', (request, response) => {
    let date_from = request.query.date_from;
    let date_to = request.query.date_to;
    //console.log(date_from, date_to);
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

/**
 * endpoint to get order by order_id
 * 
 * @param Integer order id
 * @return Json object with the obtained order or the sp-api error message
 */
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

/**
 * endpoint to get the items of the order by the order id
 * 
 * @param Integer order id
 * @return Json object with the items sold in the order or the sp-api error message
 */
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

/**
 * endpoint to get the order's buyer information by order_id  (doesn't work cause amazon)
 * 
 * @param Integer order id
 * @return Json object with the obtained order's buyer information or the sp-api error message
 */
routes.get('/spapi/order/buyerinfo/:order_id', (request, response) => {
    const {order_id} = request.params;
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                api_path: ' /orders/v0/orders/'+[order_id]+'/buyerInfo',
                method:'GET'
            });
            response.json(res);
        } catch(e) {
            response.json(e);
        }
    })();
});

/**
 * endpoint to get the order's buyer address information by order_id (doesn't work cause amazon)
 * 
 * @param Integer order id
 * @return Json object with the obtained order's buyer address information or the sp-api error message
 */
routes.get('/spapi/order/shippingaddress/:order_id', (request, response) => {
    const {order_id} = request.params;
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                api_path: ' /orders/v0/orders/'+[order_id]+'/address',
                method:'GET'
            });
            response.json(res);
        } catch(e) {
            response.json(e);
        }
    })();
});

/**
 * endpoint to get the inventory
 * 
 * @return Json object with the items of the store loaded in amazon with a high detailed data or the sp-api error message
 */
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

/**
 * endpoint to get the product saleranks by asin
 * 
 * @param String with the product asin of amazon
 * @return Json object with the detailed data of the product inside amazon or the sp-api error message
 */
routes.get('/spapi/ranking/:asin', (request, response) => {
    const {asin} = request.params;
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                api_path:'/catalog/2020-12-01/items/'+[asin],
                method:'GET',
                query:{
                    marketplaceIds: marketplaceIds,
                    includedData: ['summaries', 'salesRanks'],
                    version:'beta'
                }
            });
            response.json(res);
        } catch(e) {
            response.json(e);
        }
    })();
});

/**
 * endpoint to get finances of the orders by order id
 * 
 * @param Integer with the order id 
 * @return json object with the shipment detail of the order or the sp-api error message
 */
routes.get('/spapi/finances/order/:order_id', (request, response) => {
    const {order_id} = request.params;
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                api_path:'/finances/v0/orders/'+[order_id]+'/financialEvents',
                method:'GET',
                query:{
                    marketplaceIds: marketplaceIds,
                    version:'beta'
                }
            });
            response.json(res.FinancialEvents.ShipmentEventList);
        } catch(e) {
            response.json(e);
        }
    })();
});

/**
 * endpoint to get the movements of the refounds by order id
 * 
 * @param Integer of the order id
 * @return json object with the refunds event list of the order or the sp-api error message
 */
routes.get('/spapi/refunds/:order_id', (request, response) => {
    const {order_id} = request.params;
    (async() => {
        try{
            let res = await selling_partner_api.callAPI({
                api_path: '/finances/v0/orders/'+[order_id]+'/financialEvents',
                method:'GET',
                query:{
                    MarketplaceId: marketplaceIds,
                    version:'beta'
                }
            });
            response.json(res.FinancialEvents.RefundEventList);
        } catch(e) {
            response.json(e);
        }
    })();
});

/**
 * endpoint to get the sale metrics by date interval: dates are transformed to a -06:00 timezone according to the utc +00:00 timezone
 * 
 * @param Date with the date from
 * @param Date with the date to
 * @return a json object with the sales metrics of the amazon store or the sp-api error message
 */
routes.get('/spapi/sales/metrics', (request, response) => {
    let date_from = request.query.date_from;
    let date_to = request.query.date_to;
    let interval = date_from.split('T')[0]+'T00:00:00-06:00--'+date_to.split('T')[0]+'T23:59:59-06:00';
    console.log('interval: '+interval);
    (async() => {
        try {
            let res = await selling_partner_api.callAPI({
                operation: 'getOrderMetrics',
                endpoint: 'sales',
                query:{
                    marketplaceIds: marketplaceIds,
                    interval: interval,
                    granularity: 'Day'
                }
            });
            response.json(res);
        } catch(e) {
            response.json(e);
        }
    })();
});


module.exports = { routes }