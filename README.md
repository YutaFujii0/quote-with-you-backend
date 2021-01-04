# Serverless Quote Service

A serverless API for picking up famous quotes, with AWS Lambda and DynamoDB.
The deployment process is done by [Serverless](https://www.serverless.com/framework/docs/) framework.
Please also refer to [quote-with-you repository](https://github.com/YutaFujii0/quote-with-you) for grasping entire application.

![Image of Product](https://quote2you.yutafujii.net/ogp.png)
Product Link: https://quote2you.yutafujii.net

# Getting started

1. Install serverless

```
$ yarn --global add serverless
```
2. code
3. deploy it

# Deploy

Deploy command:

```
$ sls deploy
```
This will create CloudFormation JSON and create resources below:

* AWS Lambda
* API Gateway HTTP API
* DynamoDB (1 table)

Where to execute this command depends on how you want to deploy it.

#### Deploy from your local

Please make sure you're configured the following environment variable:

```
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

If those are set, run `sls deploy` to deploy.

#### Deploy through CircleCI

When you push something to `master` branch, Github action fires `sls deploy` command.
Please make sure you're configured the following environment variable in CircleCI:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

**NOTE**
Because this is a pet project, there's no staging/development configuration.
If you want those CI/CD pipeline, configure `.circleci/config.yml` file.

sls invoke local -f function-name -p event.json

# Development

Run lambda function locally, create `event.json` and

```
$ sls invoke local -f function-name -p event.json
```

To generate Cloudformation file without deploy, run

```
$ sls package

# this generates json files in .serverless/ directory
```
# Going further

In a real situation, you might also want to make those APIs available to public.

* Purchase your own domain
* Set custom domain to API gateway
* Add record to your host (Route53)
