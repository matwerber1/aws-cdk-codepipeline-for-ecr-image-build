#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsContainersDemoStack } from '../lib/aws-containers-demo-stack';

const app = new cdk.App();
new AwsContainersDemoStack(app, 'AwsContainersDemoStack');
