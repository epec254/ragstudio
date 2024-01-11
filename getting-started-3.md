# Quick start: Evaluation sets

In the previous guide, we showed you how to collect assessments and measure metrics using those assessments.  While a logical next step is to jump into creating a new version of the application to fix any issues you identified, Databricks suggests first creating an Evaluation Set, which is a represensative set of questions you expect your users to ask of your application, optionally with ground-truth answers to those questions.

This Evaluation Set will allow you to quickly and quantatively check the quality of a new version of your application before distributing it to stakeholders for their feedback.

See the [Evaluation Set]() conceptual guide for more details.

This guide will walk you through the process of creating an Evaluation Set.

### Step 1: Create an Evaluation Set with only Questions

#. With your business stakeholders, brainstorm a list of commonly asked qeustions.  For this quick start guide, we had a discussion with our team, and generated the below list of questions:

    - How does Spark work?
    - What is MLflow?
    - What is the difference between pySpark and DB SQL?

    .. note:: Databricks suggests working with your business stakeholders to generate a set of commonly asked questions.  If this is not possible for your use case, you can [generate questions based on your chunked documents by prompting a Large Language Model](https://mlflow.org/docs/latest/llms/rag/notebooks/question-generation-retrieval-evaluation.html).  When using this approach, Databricks suggest reviewing each generated question for accuracy.  

    <TODO> Decide if we want to include the above method or not.  If so, we probably need to make it work with our schemas.

#. Format your list of questions as an array of [ChatMessages](/machine-learning/foundation-models/api-reference.md#chatmessage) and save as a Delta Table.

    ```python
    questions = ['question 1', 'question 2']
    eval_set_delta_table = "catalog.schema.eval_set_1"
    # TODO: insert sample code for turning `questions` into a compatible Spark DF & saving as a Delta Table
    ```

    <TODO> Add this code

    .. note::  Why?  To ensure consistency between offline evaluations (such as the evaluation completed in this tutorial) and evaluations with your online traffic (such as [Asessments]() from reviewers or end users), RAG Studio requires that you format your [Evaluation Set]() using the same schema accepted by your application's Chain.  RAG Studio requires that your Chain accept input as [OpenAI-formatted ChatMessages](/machine-learning/foundation-models/api-reference.md#chatmessage), and thus, your Evaluation Set must follow the same schema: [TOOD add link with more details]().

### Step 2: Use the evaluation set to compute metrics

#. Open the RAG application's local code folder in your console
    - This will be `~/rag_studio/rag-sample-app` if you used the defaults in the [first getting started guide](getting-started-1.md).

#. Run the evaluation set through the application by running the following command in your console.

    ```bash
    rag run-eval --input catalog.schema.eval_set_1 --version 1 --env dev
    ```

    <TODO> Is the above command correct?

    **What happens behind the scenes?**

    In the background, the Chain version `1` is run through each row of the `catalog.schema.eval_set_1` using an identical compute environment to how your Chain is served. For each row of `catalog.schema.eval_set_1`, a [Trace]() is written to the `request_log_table` based on that row's inputs.

    <TODO> Add link to the full details, more things happen like metrics running, etc - but this is the bare bones things they need to  know.

#. Similar to the `open-eval` command you [ran in the previous guide](getting-started-2.md#step-3-view-metrics), this command will open a Notebook to view data and the Metrics.

#. For now, we will skip over viewing the metrics, but will come back to this later.

### Step 3: Optionally - collect ground truth data for each question

<TODO> DO we want to talk about ALL data they could add here (retrieved contexts, faithfullness, etc) or just answers?  personally, i think it might be too much to do more than answers in the quick start, but we should link to details about the others.  especially since the only way a user can measure Retrieval metrics in v1 is through a ground-truth set.... :(

Databricks suggests adding ground-truth answers and retrieved contexts to the questions you just created - this will allow you to more accuratly measure the quality of your application.  However, *this step is optional* and you can still use RAG Studio's functionality without doing so - the only missing functionality is the computation of a [answer correctness metric](metrics.md) + [retrieval metrics]().

To add answers to our Evaluation Set, we will use the RAG application's generated answers as a starting point and ask our expert users to accept or edit these responses.

<roadmap> Collect ground truth on the retrieved chunks using the UI.

.. note:: <Roadmap> RAG Studio's [Explorations UI]() and SDK enable you to quickly load existing [Traces]() for review by expert users.  Until this functionality is available, follow the below steps to manually load [Traces]().

#. Export the `request_log_table` as `traces.jsonl`

    ```python
    # TODO: Sample code for doing this
    ```
#. Create `instructions.md` with the following contents:

    ```markdown
    # insert the instructions here!!!
    ```

    .. warning:: To ensure high quality and consistant data from your expert users, Databricks strongly suggests writing simple, clear instructions explaining how you expect experts to rate answers.  

#. Copy `instructions.md` and `traces.jsonl` to your local development environment.

#. Open the RAG application's local code folder in your console
    - This will be `~/rag_studio/rag-sample-app` if you used the defaults in the [first getting started guide](getting-started-1.md).

#. Load the questions/answers to the Review App by running the following command in your console.

    ```bash
    rag start-review --traces traces.jsonl --instructions instructions.md --version 1 --env dev
    ```

    ```bash
    INSERT OUTPUT WITH THE REVIEW URL
    http://review.app/sdfdsf
    ```

    <TODO> Update this command & output to be accurate.

#. Go to the Review App URL.  On the left side, you will see the converastions loaded in `Chats to review`. Go through each conversation and either press thumbs up to indicate it is correct OR edit the response to be accurate.

    <TODO> Put in screenshots

    .. note :: This step would normally be done in partnership with your business stakeholders.  For instructions on how to enable these stakeholders to access the review app, see ADD LINK.

#. Use the collected data to update your Evaluation Set with answers.

    ```python
    # Provide input as ChatMessages format - same as without ground truth
    input_messages = [
        {
        "role": "user",
        "content": "This is a question to ask?"
        }
    ]

    # Similar to input, RAG Studio requires your outputs to be in the same schema as produced by your Chain.  Since the Chain is required to produce [ChatMessages], you must provide the role=assistant message.
    # Return in https://docs.databricks.com/en/machine-learning/foundation-models/api-reference.html#chat-response format
    outputs = {
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "this is the correct answer",
                },
                "finish_reason": "stop",
            }
        ],
        "object": "chat.completions",
    }

    retrieved_chunks = [] # TODO: Add this schema based on our Assessment schema
 
    # TODO: insert sample code to ETL from Assessments & Traces that exist to an evluation set
    ```

    <TODO> Add this sample code.

#. To help you get started quickly, we have completed the above step for you with an example set of questions and answers.

    <TODO> Add sample data from QuinnBot golden set formatted in the right format.

### Step 4: Re-run the evalution with the complete ground truth

#. Optionally, you can re-run the same command as above, but with your completed evaluation set to see the additional metrics that are computed with the ground-truth data.

    ```bash
    rag run-eval --input catalog.schema.eval_set_1_complete --version 1 --env dev
    ```

## Next steps
 

