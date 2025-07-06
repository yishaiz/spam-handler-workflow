import { Stack, StackProps, aws_logs as logs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

export class SpamHandlerWorkflowTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, "LogGroup");

    const start = new sfn.Pass(this, 'Start');

    const addToKnownFolder = new sfn.Pass(this, 'Add to Known Folder');
    const handleInvalid = new sfn.Pass(this, 'Invalid Input');

    const inContactList = new sfn.Choice(this, 'InContactList')
      .when(sfn.Condition.booleanEquals('$.is_contact', true), addToKnownFolder)
      .when(sfn.Condition.booleanEquals('$.is_contact', false), addToKnownFolder)
      .otherwise(handleInvalid);

    const definition = start.next(inContactList);

    new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
      stateMachineType: sfn.StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      },
    });
  }
}
