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
        add_to_known_folder = sfn.Pass(self, "Add to Known Folder")
        read_message = sfn.Pass(self, "Read Message")
        handle_invalid = sfn.Pass(self, "Invalid Input")
        check_content = sfn.Pass(self, "Check Message Content")
        delete_message = sfn.Pass(self, "Delete Message")

        # Read path after known folder
        known_path = add_to_known_folder.next(read_message)

        # is_spam? → delete or known_path
        is_spam_choice = sfn.Choice(self, "IsSpamChoice")
        is_spam_choice.when(
            sfn.Condition.boolean_equals("$.is_spam", True),
            delete_message
        ).when(
            sfn.Condition.boolean_equals("$.is_spam", False),
            known_path
        ).otherwise(handle_invalid)

        # contact check → known_path or spam check
        in_contact_list = sfn.Choice(self, "InContactList")
        in_contact_list.when(
            sfn.Condition.and_(
                sfn.Condition.is_present("$.is_contact"),
                sfn.Condition.or_(
                    sfn.Condition.boolean_equals("$.is_contact", True),
                    sfn.Condition.boolean_equals("$.is_contact", False)
                )
            ),
            sfn.Choice(self, "ContactOrNot")
            .when(
                sfn.Condition.boolean_equals("$.is_contact", True),
                known_path
            )
            .when(
                sfn.Condition.boolean_equals("$.is_contact", False),
                check_content.next(is_spam_choice)
            )
            .otherwise(handle_invalid)
        ).otherwise(handle_invalid)

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
