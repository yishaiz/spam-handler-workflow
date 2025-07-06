import { Stack, StackProps, aws_logs as logs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

export class SpamHandlerWorkflowTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'LogGroup');

    const start = new sfn.Pass(this, 'Start');
    const addToKnownFolder = new sfn.Pass(this, 'Add to Known Folder');
    const readMessage = new sfn.Pass(this, 'Read Message');
    const handleInvalid = new sfn.Pass(this, 'Invalid Input');
    const checkContent = new sfn.Pass(this, 'Check Message Content');
    const deleteMessage = new sfn.Pass(this, 'Delete Message');

    const knownPath = addToKnownFolder.next(readMessage);

    const isSpamChoice = new sfn.Choice(this, 'IsSpamChoice')
      .when(sfn.Condition.booleanEquals('$.is_spam', true), deleteMessage)
      .when(sfn.Condition.booleanEquals('$.is_spam', false), knownPath)
      .otherwise(handleInvalid);

    const inContactList = new sfn.Choice(this, 'InContactList')
      .when(
        sfn.Condition.and(
          sfn.Condition.isPresent('$.is_contact'),
          sfn.Condition.or(
            sfn.Condition.booleanEquals('$.is_contact', true),
            sfn.Condition.booleanEquals('$.is_contact', false)
          )
        ),
        new sfn.Choice(this, 'ContactOrNot')
          .when(sfn.Condition.booleanEquals('$.is_contact', true), knownPath)
          .when(sfn.Condition.booleanEquals('$.is_contact', false), checkContent.next(isSpamChoice))
          .otherwise(handleInvalid)
      )
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
