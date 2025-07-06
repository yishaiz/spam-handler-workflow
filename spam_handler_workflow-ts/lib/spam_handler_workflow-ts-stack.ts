import { Stack, StackProps, aws_logs as logs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

export class SpamHandlerWorkflowTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const passState = new sfn.Pass(this, 'PassState', {
      comment: 'This is a simple pass state',
    });

    const logGroup = new logs.LogGroup(
      this, "StepFunctionLogGroup", {
      // logGroupName: "/aws/vendedlogs/states/ParallelTasksLogGroupNewTs"
    });

    new sfn.StateMachine(this, 'SimpleStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(passState),
      stateMachineType: sfn.StateMachineType.EXPRESS,
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      }
    });
  }
}
