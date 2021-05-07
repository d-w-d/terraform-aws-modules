import * as SES from "aws-sdk/clients/ses";
import { APIGatewayEvent } from "aws-lambda";
import axios from "axios";

/**
 * The callback result object has to be <exact>
 * If you have excess properties then lambda-api-gateway will register a generic error
 */
interface ICallbackResult {
  isBase64Encoded: boolean;
  headers: {
    "Content-Type": "application/json";
    "Access-Control-Allow-Origin": "*";
  };
  statusCode: 200 | 500;
  body: string; // JSON.stringify
}

/**
 * Email function
 */
export const emailer = async (
  _event: APIGatewayEvent,
  callback: AWSLambda.Callback<ICallbackResult>
): Promise<void> => {
  // ------------->>>

  // Define params
  const successResponse: ICallbackResult = {
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };

  const failureResponse: ICallbackResult = {
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 500,
    body: JSON.stringify({ success: false }),
  };

  // Call ses-email api
  return new Promise((resolve, reject) => {
    sendEmail("Some cool message", (err: Error) => {
      if (!!err) {
        // NOTE: according to [here](https://stackoverflow.com/a/55642476/8620332)
        // the only way to send a custom error is to return null to the callback's error
        // argument and then send response object with 5XX error code
        console.log(JSON.stringify(failureResponse));
        callback(null, {
          ...failureResponse,
          body: JSON.stringify({
            success: false,
            message: err.message,
            errorMessage: err.message,
          }),
        });
        reject();
        return;
      }

      console.log(JSON.stringify(successResponse));
      callback(null, successResponse);
      resolve();
      return;
    });
  });
};

/**
 * ...
 */
async function sendEmail(message: string, done: (err, data) => void) {
  // -------------------------------------------------------------->>>

  // Check that the env vars are not undefined
  const sourceEmail = process.env.STATIC_SENDER_EMAIL;
  if (!sourceEmail) {
    const err = new Error("process.env.STATIC_SENDER_EMAIL undefined");
    done(err, message);
    return;
  }

  const toEmailAddresses = process.env.STATIC_RECEIVER_EMAIL
    ? [process.env.STATIC_RECEIVER_EMAIL]
    : undefined;
  if (!toEmailAddresses) {
    const err = new Error("process.env.STATIC_RECEIVER_EMAIL undefined");
    done(err, message);
    return;
  }

  // Define object with everything SES needs to send email
  const params = {
    Destination: {
      // Note: see here to send to non-verified addresses
      // https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html
      ToAddresses: toEmailAddresses,
    },
    Source: sourceEmail,
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `
          ==========================================
            Message Submitted: ${new Date().toISOString()}
          ------------------------------------------
            ${message}
          ==========================================
          `,
        },
      },
      Subject: {
        Data: "Cloudwatch Event",
        Charset: "UTF-8",
      },
    },
  };
  new SES().sendEmail(params, done);
}
