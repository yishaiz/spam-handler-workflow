from aws_cdk import (
    Stack,
    aws_stepfunctions as sfn,
    aws_logs as logs,
    Duration
)
from constructs import Construct

class SpamHandlerWorkflowPyStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        log_group = logs.LogGroup(self, "LogGroup")
        start = sfn.Pass(self, "Start")

        wait = sfn.Wait(self, "Wait5Seconds",
                        time=sfn.WaitTime.duration(Duration.seconds(5)))

        success = sfn.Pass(self, "Success")

        choice = sfn.Choice(self, "ShouldWait?")
        choice.when(sfn.Condition.boolean_equals("$.wait", True), wait.next(success))
        choice.otherwise(success)

        definition = start.next(choice)

        sfn.StateMachine(self, "StateMachine",
                         definition_body=sfn.DefinitionBody.from_chainable(definition),
                         state_machine_type=sfn.StateMachineType.EXPRESS,
                         logs=sfn.LogOptions(
                             destination=log_group,
                             level=sfn.LogLevel.ALL,
                             include_execution_data=True
                         ))
