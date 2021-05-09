######################
# Required Module Vars
######################

variable "bucket_name" {
  description = "Name of S3 bucket"
}

######################
# Optional Module Vars
######################
variable "bucket_acl" {
  description = "ACL for bucket"
  default     = "public-read"
}

###
### CORS SETTINGS
###

variable "cors_rule_enabled" {
  default     = true
  type        = bool
  description = "Controls whether to configure or omit the 'cors_rule' block"
}
variable "cors_rule_allowed_headers" {
  type        = list(string)
  default     = ["*"]
  description = "Ignored if !cors_enabled"
}
variable "cors_rule_allowed_methods" {
  type        = list(string)
  default     = ["GET", "HEAD", "POST", "PUT", "DELETE"]
  description = "Ignored if !cors_enabled"
}
variable "cors_rule_allowed_origins" {
  type        = list(string)
  default     = ["*"]
  description = "Ignored if !cors_enabled"
}

variable "cors_rule_expose_headers" {
  type        = list(string)
  default     = ["ETag"]
  description = "Ignored if !cors_enabled"
}

variable "cors_rule_max_age_seconds" {
  default     = "3000"
  description = "Ignored if !cors_enabled"
}


###
### WEBSITE SETTINGS
###

variable "website_enabled" {
  default     = true
  type        = bool
  description = "Controls whether to configure or omit the 'website' block"
}

variable "website_index_document" {
  default     = "index.html"
  description = "Ignored if !website_enabled"
}

variable "website_error_document" {
  default     = "index.html"
  description = "Ignored if !website_enabled"
}

variable "website_routing_rules" {
  default     = null
  description = "Ignored if !website_enabled"
}
