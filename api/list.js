import handler from "./libs/handler-lib";
import dyndb from "./libs/dynamodb-lib";

export const main = handler( async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId" : event.requestContext.identity.cognitoIdentityId
    }
  };

  const result = await dyndb.query(params);
  return result.Items;
});
