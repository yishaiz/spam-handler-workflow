from aws_cdk import (
    Stack,
    aws_stepfunctions as sfn
)
from constructs import Construct

class SpamHandlerWorkflowPyStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        pass_state = sfn.Pass(self, "PassState",
                              comment="This is a simple pass state")

        sfn.StateMachine(self, "SimpleStateMachine",
                         definition_body=sfn.DefinitionBody.from_chainable(pass_state),
                         state_machine_type=sfn.StateMachineType.EXPRESS)
