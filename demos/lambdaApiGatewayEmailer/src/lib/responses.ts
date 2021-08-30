import { ICallbackResult } from "./models";

// Define params
export const successResponse: ICallbackResult = {
  isBase64Encoded: false,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  statusCode: 200,
  body: JSON.stringify({ success: true }),
};

export const failureResponse: ICallbackResult = {
  isBase64Encoded: false,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  statusCode: 500,
  body: JSON.stringify({ success: false }),
};
