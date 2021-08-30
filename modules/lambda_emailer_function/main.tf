# Start with role with basic assume-role policy
resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.prefix}${var.role_name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [ "lambda.amazonaws.com" ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}



# Create attachment to our named role of the list of policies given by list of arn's
resource "aws_iam_role_policy_attachment" "role-policy-attachment" {
  role       = "${var.prefix}${var.role_name}"
  count      = length(var.iam_policy_arn_list)
  policy_arn = var.iam_policy_arn_list[count.index]
  depends_on = [aws_iam_role.iam_for_lambda]
}

# Create sendmail lambda function resource
resource "aws_lambda_function" "sendmail" {
  filename      = var.zipped_file_and_path_name
  function_name = "${var.prefix}${var.lambda_function_name}"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "exports.handler"
  timeout       = var.lambda_timeout

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  # source_code_hash = "${filebase64sha256("dist-lambda/exports.js.zip")}"
  source_code_hash = filebase64sha256(var.zipped_file_and_path_name)

  runtime = var.node_runtime

  environment {
    variables = {
      billing                       = "${var.prefix}${var.billing_tag}"
      STATIC_RECEIVER_EMAILS        = var.STATIC_RECEIVER_EMAILS
      STATIC_PRIMARY_SENDER_EMAIL   = var.STATIC_PRIMARY_SENDER_EMAIL
      STATIC_SECONDARY_SENDER_EMAIL = var.STATIC_SECONDARY_SENDER_EMAIL
      SITE_LIST_SOURCES             = var.SITE_LIST_SOURCES
      EXTRA_SITES                   = var.EXTRA_SITES
      S3_BUCKET_NAME                = var.S3_BUCKET_NAME
      RECAPTCHA_SECRET              = var.RECAPTCHA_SECRET
      RECAPTCHA_BYPASS_CODE         = var.RECAPTCHA_BYPASS_CODE
      GITHUB_ACCESS_TOKEN           = var.GITHUB_ACCESS_TOKEN
    }
  }
}




