import { Stack, StackProps, aws_logs as logs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

export class SpamHandlerWorkflowTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'LogGroup');

    const start = new sfn.Pass(this, 'Start');

    const addToKnownFolder = new sfn.Pass(this, 'Add to Known Folder');
    const handleInvalid = new sfn.Pass(this, 'Invalid Input');

    const choice = new sfn.Choice(this, 'InContactList');

    choice.when(
      sfn.Condition.and(
        sfn.Condition.isPresent('$.is_contact'),
        sfn.Condition.or(
          sfn.Condition.booleanEquals('$.is_contact', true),
          sfn.Condition.booleanEquals('$.is_contact', false)
        )
      ),
      addToKnownFolder
    ).otherwise(handleInvalid);

    const definition = start.next(choice);

    new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
      stateMachineType: sfn.StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true
      }
    });
  }
}
