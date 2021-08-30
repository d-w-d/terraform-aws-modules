/**
 * The callback result object has to be <exact>
 * If you have excess properties then lambda-api-gateway will register a generic error
 */
export interface ICallbackResult {
  isBase64Encoded: boolean;
  headers: {
    "Content-Type": "application/json";
    "Access-Control-Allow-Origin": "*";
  };
  statusCode: 200 | 500;
  body: string; // JSON.stringify
}
