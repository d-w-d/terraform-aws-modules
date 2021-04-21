# Simple Static Site Demo

## Overview

This demo lets you build a simple static site without cloudfront -- useful for development sites.

First, you create an S3 bucket with terraform wrapped in the bash script `_terraform`. Then you upload static files to the bucket using the AWS CDK wrapped in the bash script `_deploy_aws`, which also zips media files.

## Quick start

```
cp .env-template .env
./_terraform init .
./_terraform run .
./_deploy_aws
```
