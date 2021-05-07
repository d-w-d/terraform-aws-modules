import { emailer } from "./lib/emailer";
const AWS = require("aws-sdk");

console.log("Hello from the outside");

import { Handler, APIGatewayEvent } from "aws-lambda";

/**
 *
 * Lambda Entry Point
 *
 * @param  {any} event:
 * Payload object
 *
 * @param  {AWSLambda.Context} context:
 * AWS Object with params and methods;
 * Use `context.done()` to immediately stop lambda process
 *
 * @param  {AWSLambda.Callback} callback
 * Function to call to return response to user
 *
 */
export const handler: Handler = async function (
  event: APIGatewayEvent,
  _context: AWSLambda.Context,
  callback: AWSLambda.Callback
) {
  // Log AWS version
  console.log(`AWS Version: ${AWS.VERSION}`);

  // If you want to return a response to user but continue lambda process, then uncomment this:
  // context.callbackWaitsForEmptyEventLoop = false;

  console.log("Starting Email Process...");
  console.log("typeof event >>>>", typeof event, JSON.stringify(event), "<<<<");
  console.log("event.queryStringParameters:", event.queryStringParameters);

  await emailer(event, callback).catch((_) => {
    console.log("The rejected promise has been herein caught");
  });

  console.log("Finishing Email Process.");

  callback();
};
