import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dyndb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) =>  {
  const data = JSON.parse(event.body); // req body viene en event.body
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      Id: uuid.v1(),
      origAddress: data.origAddress,
      origComputedAddress: data.origComputedAddress,
      origLat: data.origLat,
      origLon: data.origLon,
      destAddress: data.destAddress,
      destComputedAddress: data.destComputedAddress,
      destLat: data.destLat,
      destLon: data.destLon,
      distance: data.distance,
      createdAt: Date.now(),
    }
  };

  await dyndb.put(params);

  return params.Item;
});
