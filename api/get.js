import handler from "./libs/handler-lib";
import dyndb from "./libs/dynamodb-lib";

export const main = handler( async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id,
    },
  };

  const result = await dyndb.get(params);

  if (!result.Item) {
    throw new Error("Item not found");
  }

  return result.Item;
});
