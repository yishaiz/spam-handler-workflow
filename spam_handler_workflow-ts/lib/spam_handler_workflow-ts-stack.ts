import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';



export class SpamHandlerWorkflowTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const passState = new sfn.Pass(this, 'PassState', {
      comment: 'This is a simple pass state',
    });

    new sfn.StateMachine(this, 'SimpleStateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(passState),
      stateMachineType: sfn.StateMachineType.EXPRESS,
    });
  }
}

