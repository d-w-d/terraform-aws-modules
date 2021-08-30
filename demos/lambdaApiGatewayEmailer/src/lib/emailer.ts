import * as SES from "aws-sdk/clients/ses";
import { APIGatewayEvent } from "aws-lambda";
import axios from "axios";

import { ICallbackResult } from "./models";
import { failureResponse, successResponse } from "./responses";

/**
 * Email function
 */
export const emailer = async (
  event: APIGatewayEvent,
  callback: AWSLambda.Callback<ICallbackResult>
): Promise<void> => {
  // --->>

  // Extract body and query params from event
  let body: any;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    callback(null, {
      ...failureResponse,
      body: JSON.stringify({
        success: false,
        message: "No parseable body provided in request: " + event.body,
      }),
    });
    return;
  }

  // Extract captcha bypass code from event
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
  // --->>

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
  const STATIC_PRIMARY_SENDER_EMAIL = process.env.STATIC_PRIMARY_SENDER_EMAIL;
  if (!STATIC_PRIMARY_SENDER_EMAIL) {
    const err = new Error("process.env.STATIC_PRIMARY_SENDER_EMAIL undefined");
    done(err, data);
    return;
  }

  let STATIC_RECEIVER_EMAILS: string[];
  try {
    STATIC_RECEIVER_EMAILS = JSON.parse(process.env.STATIC_RECEIVER_EMAILS);
  } catch (e) {
    const err = new Error(
      "STATIC_RECEIVER_EMAILS couldn't be parsed: " +
        process.env.STATIC_RECEIVER_EMAILS
    );
    done(err, data);
    return;
  }

  // Define object with everything SES needs to send email
  const params = {
    Destination: {
      // Note: see here to send to non-verified addresses
      // https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html
      ToAddresses: STATIC_RECEIVER_EMAILS,
    },
    Source: STATIC_PRIMARY_SENDER_EMAIL,
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
