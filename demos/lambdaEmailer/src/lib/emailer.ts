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
  event: APIGatewayEvent,
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

  if (!event.body) {
    callback(null, {
      ...failureResponse,
      body: JSON.stringify({
        success: false,
        message: "No body provided in request",
      }),
    });
    return Promise.resolve();
  }

  // Extract body and query params from event
  const body = JSON.parse(event.body);
  const captchaBypassCode = event.queryStringParameters?.captchaBypassCode;

  // Call ses-email api
  return new Promise((resolve, reject) => {
    sendEmail(body, captchaBypassCode, (err: Error) => {
      if (!!err) {
        // NOTE: according to [here](https://stackoverflow.com/a/55642476/8620332)
        // the only way to send a custom error is to return null to the callback's error
        // argument and then send response object with 5XX error code
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
      callback(null, successResponse);
      resolve();
      return;
    });
  });
};

/**
 * Function to process data and recaptcha details
 */
async function sendEmail(
  data: {
    name: string;
    email: string;
    message: string;
    recaptchaToken?: string;
  },
  recaptchaBypassCode: string | undefined,
  done: (err, data) => void
) {
  // -------------------------->>>

  // Logic to decide whether to verify RECAPTCHA token
  const isRecaptchaBypassed =
    process.env.RECAPTCHA_BYPASS_CODE === recaptchaBypassCode;
  const isRecaptchaRequired =
    !!process.env.RECAPTCHA_SECRET && !isRecaptchaBypassed;

  if (isRecaptchaRequired) {
    const verificationResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify` +
        `?secret=${process.env.RECAPTCHA_SECRET}` +
        `&response=${data.recaptchaToken}`
    );
    if (!verificationResponse.data.success) {
      const err = new Error("Recaptcha verification failed");
      done(err, data);
      return;
    }
  }

  // Check that the env vars are not undefined
  const sourceEmail = process.env.STATIC_SENDER_EMAIL;
  if (!sourceEmail) {
    const err = new Error("process.env.STATIC_SENDER_EMAIL undefined");
    done(err, data);
    return;
  }

  const toEmailAddresses = process.env.STATIC_RECEIVER_EMAIL
    ? [process.env.STATIC_RECEIVER_EMAIL]
    : undefined;
  if (!toEmailAddresses) {
    const err = new Error("process.env.STATIC_RECEIVER_EMAIL undefined");
    done(err, data);
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
            Dynamic Sender Name: ${data.name}
            Dynamic Sender email: ${data.email}
            Message Submitted: ${new Date().toISOString()}
          ------------------------------------------
            ${data.message}
          ==========================================
          `,
        },
      },
      Subject: {
        Data: "AutoEmail From " + data.name,
        Charset: "UTF-8",
      },
    },
  };
  new SES().sendEmail(params, done);
}
