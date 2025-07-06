import aws_cdk as core
import aws_cdk.assertions as assertions

from spam_handler_workflow_py.spam_handler_workflow_py_stack import SpamHandlerWorkflowPyStack

# example tests. To run these tests, uncomment this file along with the example
# resource in spam_handler_workflow_py/spam_handler_workflow_py_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = SpamHandlerWorkflowPyStack(app, "spam-handler-workflow-py")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
