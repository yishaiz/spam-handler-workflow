from aws_cdk import (
    Stack,
    aws_stepfunctions as sfn,
    aws_logs as logs
)
from constructs import Construct

class SpamHandlerWorkflowPyStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        log_group = logs.LogGroup(self, "LogGroup")

        start = sfn.Pass(self, "Start")

        in_contact_list = sfn.Choice(self, "InContactList")

        add_to_known_folder = sfn.Pass(self, "Add to Known Folder")
        handle_invalid = sfn.Pass(self, "Invalid Input")

        in_contact_list.when(
            sfn.Condition.boolean_equals("$.is_contact", True),
            add_to_known_folder
        ).when(
            sfn.Condition.boolean_equals("$.is_contact", False),
            add_to_known_folder
        ).otherwise(
            handle_invalid
        )

        definition = start.next(in_contact_list)

        sfn.StateMachine(
            self, "StateMachine",
            definition_body=sfn.DefinitionBody.from_chainable(definition),
            state_machine_type=sfn.StateMachineType.EXPRESS,
            logs=sfn.LogOptions(
                destination=log_group,
                level=sfn.LogLevel.ALL,
                include_execution_data=True
            )
        )
