from aws_cdk import (
    Stack,
    aws_stepfunctions as sfn,
    aws_logs as logs,
)
from constructs import Construct

class SpamHandlerWorkflowPyStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        pass_state = sfn.Pass(self, "PassState",
                              comment="This is a simple pass state")

        log_group = logs.LogGroup(
            self, "StepFunctionLogGroup",
            # log_group_name="/aws/vendedlogs/states/ParallelTasksLogGroupNewPy"
        )

        sfn.StateMachine(
            self, "SimpleStateMachine",
            state_machine_type=sfn.StateMachineType.EXPRESS,
            definition_body=sfn.DefinitionBody.from_chainable(pass_state),
            logs=sfn.LogOptions(
                destination=log_group,
                level=sfn.LogLevel.ALL,
                include_execution_data=True
            )
        )
