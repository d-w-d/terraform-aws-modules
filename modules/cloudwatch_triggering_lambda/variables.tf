
#######################################
# Variables supplied by module caller #
#######################################
variable "lambda_function_name" {
  description = "Name for the Lambda function."
  default     = "lambda-sendmail"
}

variable "lambda_function_arn" {
  description = "ARN for the Lambda function."
}


variable "cronjob" {
  description = "Cronjob expression of form '* * * * ? *'"
}



