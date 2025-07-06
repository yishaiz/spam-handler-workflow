import { Stack, StackProps, Duration, aws_logs as logs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

export class SpamHandlerWorkflowTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'LogGroup');

    const start = new sfn.Pass(this, 'Start');

    const wait = new sfn.Wait(this, 'Wait5Seconds', {
      time: sfn.WaitTime.duration(Duration.seconds(5))
    });

    const success = new sfn.Pass(this, 'Success');

    const choice = new sfn.Choice(this, 'ShouldWait?');
    choice.when(sfn.Condition.booleanEquals('$.wait', true), wait.next(success));
    choice.otherwise(success);

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
