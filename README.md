# AWS CDK Pipeline for ECR Image Pipeline

This [Amazon Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) project provides you with a continuous integration (CI) pipeline to build Docker images and push them to [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/).

# Architecture

This project deploys: 

1. An empty [AWS CodeCommit](https://aws.amazon.com/codecommit/) repository to later hold your Dockerfile. We will call this your "Dockerfile repository".

2. An empty ECR container repository, which we will call your "container repository". 

3. A [AWS CodePipeline](https://aws.amazon.com/codepipeline/) pipeline that triggers when changes are pushed to the master branch of your Dockerfile repository. The pipeline passes the contents of your Dockerfile repository to an [AWS CodeBuild](https://aws.amazon.com/codebuild/) project. The project executes whatever statements you specify within the `buildspec.yml` file within the Dockerfile repository. At it's heart, these should be `docker build` and `docker push` commands, with a few other administrative requirements. I will provide you with an example, later on. 

# What is the CDK?

The AWS CDK is a library that is (as of 11/13/2019) GA for Python, Javascript, and Typescript, and is in preview for Java and .Net. You may refer to the [CDK docs](for details), but at a high level, it is an abstraction over AWS CloudFormation that makes it much faster and simpler to write CloudFormation templates. The abstraction requires far fewer lines of code, but is still ultimately compiled by the accompanying CDK CLI into native CloudFormation and launched as a standard CloudFormation stack. 


# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
