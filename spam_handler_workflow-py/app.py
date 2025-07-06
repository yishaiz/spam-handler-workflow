#!/usr/bin/env python3
import os

import aws_cdk as cdk

from spam_handler_workflow_py.spam_handler_workflow_py_stack import SpamHandlerWorkflowPyStack


app = cdk.App()
SpamHandlerWorkflowPyStack(app, "SpamHandlerWorkflowPyStack",
    
    )

app.synth()
