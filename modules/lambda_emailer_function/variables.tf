
#######################################
# Variables supplied by module caller #
#######################################

variable "prefix" {
  description = "Prefix for all variables supplied from calling module"
}

variable "lambda_function_name" {
  description = "Name of lambda function"
}

variable "zipped_file_and_path_name" {
  description = "Path and name of zipped file containing the lambda function; supplied by module caller"
}


#################################
# Variables with default values #
#################################

variable "role_name" {
  description = "Name for the Lambda role."
  default     = "lambda-role"
}

variable "billing_tag" {
  description = "Name for a tag to keep track of resource for billing."
  default     = "lambda-biller"
}

variable "RECAPTCHA_SECRET" {
  # TO BE DEPLOYED AS ENV VARIABLE #
  description = "If a recaptcha secret key is provided, then the Lambda function will seek to verify a recaptcha token passed from client"
  default     = ""
}

variable "RECAPTCHA_BYPASS_CODE" {
  # TO BE DEPLOYED AS ENV VARIABLE #
  description = "If this bypass code is provided at endpoint invocation, then the requirement for RECAPTCHA will be bypassed"
  default     = ""
}

variable "SITE_LIST_SOURCES" {
  description = "List of urls to JSON objects with array of sites to be checked"
  default     = ""
}

variable "EXTRA_SITES" {
  description = "List of urls to be checked"
  default     = ""
}

variable "STATIC_PRIMARY_SENDER_EMAIL" {
  description = "..."
  default     = ""
}

variable "STATIC_SECONDARY_SENDER_EMAIL" {
  description = "..."
  default     = ""
}

variable "S3_BUCKET_NAME" {
  description = "S3 bucket name that Lambda can write to iff you overwrite default policy"
  default     = ""
}

variable "node_runtime" {
  description = "Node version of Lambda environment"
  default     = "nodejs10.x"
}

variable "lambda_timeout" {
  description = "Time before lambda function times out"
  default     = "3"
}

variable "iam_policy_arn_list" {
  type        = list(string)
  description = "IAM Policies to be attached to role"
  default     = ["arn:aws:iam::aws:policy/CloudWatchFullAccess", "arn:aws:iam::aws:policy/AmazonSESFullAccess"]
}
