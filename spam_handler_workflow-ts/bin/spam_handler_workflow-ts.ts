#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SpamHandlerWorkflowTsStack } from '../lib/spam_handler_workflow-ts-stack';

const app = new cdk.App();
new SpamHandlerWorkflowTsStack(app, 'SpamHandlerWorkflowTsStack', {
 
});