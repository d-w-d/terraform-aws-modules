resource "aws_cloudwatch_event_rule" "cronjob" {
  name                = "cronjob-firer"
  description         = "Fires according to supplied cronjob expression"
  schedule_expression = "cron(${var.cronjob})"
}

resource "aws_cloudwatch_event_target" "cronjob_lambda_trigger" {
  target_id = "my-lambda-function"
  rule      = aws_cloudwatch_event_rule.cronjob.name
  arn       = var.lambda_function_arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_check_foo" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  principal     = "events.amazonaws.com"
  function_name = var.lambda_function_name
  source_arn    = aws_cloudwatch_event_rule.cronjob.arn
}
