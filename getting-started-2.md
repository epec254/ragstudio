# Quick start: Collecting assessments & viewing metrics

The following guide walks you how to collect feedback (called [Assessments](metrics.md)) on RAG Studio’s sample application.  It assumes you have followed the steps in [Quick start: Deploy a RAG app](getting-started-1.md).


## Collect Asessments

### Step 1: Collect Asessments using the Review App

#. Using the Review App, press `New Chat` on the left side.
    <TODO> Insert screenshot
#. Interact with the application by asking one or more questions.  If you aren't sure what to ask, here are a few suggestions:
    - How does Spark work?
    - What is MLflow?
    - What is the difference between pySpark and DB SQL?
#. After asking a question, you will see the feedback widget appear below the bot's answer.  At minimum, provide a thumbs up or thumbs down signal for "Is this response correct for your question?".
    .. note:: For more information on the types of feedback, see [Feedback](metrics.md)
    <TODO> Update this URL

### Step 2: Collect Asessments from a LLM judge

#. The sample app is configured to automatically have an LLM judge provide Asessments for every interection with the application.

    .. note :: For more information on configuring LLM judges, see [link]().
    <TODO> Add this

#. As such, an LLM judge has already provided asessments for the questions you asked in Step 1!

## Review Metrics based on Assessments

### Step 3. View metrics

The primary reason to collect assessments is to measure metrics to understand the quality, cost, and latency of your application.  Based on these metrics, you can determine if your application is ready for production or you need to iterate on the settings to improve the quality, cost or latency.

.. note:: <Roadmap> RAG Studio's [Explorations UI]() enables you visualize and interact with [Metrics]() in order to identify the subset of queries that are underperforming.  Until this functionality is available, you can interact with the Metrics through Notebook-based visualizations as shown below.

#. Open the RAG application's local code folder in your console
    - This will be `~/rag_studio/rag-sample-app` if you used the defaults in the [first getting started guide](getting-started-1.md).
#. Open the Metrics notebook by running the following command in your console.

    ```bash
    rag open-eval -env dev
    ```

    <TODO> @Alkis - what is this command?  i made this up.

#. In the Notebook, configure the parameters at the top as follows:
    - `App Version`: select `1`
    - `Assessment Source`: select either 
        - `Users`: shows metrics computed based on the assessments from the Review App
        - `LLaMa2-70B-Chat-Judge`: shows metrics computed based on the assessments from the LLM judge

    <TODO> Sync this to answer from this [slack thread](https://databricks.slack.com/archives/C06AGRU799A/p1704983955530409)

#. Press Run All to recompute the metrics.

#. Congrats!  You are now able to see quality, cost, and latency metrics that were computed based on the assessments you collected.

    <TODO> Insert screenshots of the metrics

    .. note :: For a more detailed explanation of what each metric means and how to use these metrics to improve your app's quality, [read the Assessments & Metrics guide](metrics.md)

### Step 4. View the generated logs and assessments

After viewing metrics, the next step is to investigate why a given metric is underperforming.  Every time your application is used (such as you did in this guide in the first step), <RAG Studio> logs the detailed steps (called a [Trace]()) that were taken to generate the response to the user's question.  These Traces are then linked to every provided Assessment.  Traces and Assessments are stored as Delta Tables in your application's configured Unity Catalog schema.

.. note:: See the [Logging]() guide for more information on how Traces and logging works.

.. note:: <Roadmap> RAG Studio's [Investigations UI]() enables you to visualize the resulting [Traces]() and [Assessments]() in a UI.  Until this functionality is available, you can follow [INSERT LINK]() steps to view the [Traces]() in the [Review UI]() or use the below steps to view the [Traces]() and [Assessments]() as Delta Tables.


#. Open the RAG application's local code folder in your console
    - This will be `~/rag_studio/rag-sample-app` if you used the defaults in the [first getting started guide](getting-started-1.md).

#. Open the Investigations notebook by running the following command in your console.

    ```bash
    rag open-investigations -env dev
    ```

    <TODO> @Alkis - what is this command?  i made this up.

#. In the Notebook, configure the parameters at the top as follows:
    - `App Version`: select `1`
    - `Assessment Source`: select either 
        - `Users`: shows metrics computed based on the assessments from the Review App
        - `LLaMa2-70B-Chat-Judge`: shows metrics computed based on the assessments from the LLM judge

#. Scroll through the notebook to find the metric that you want to investigate.  In this example, let's review the Faithfulness metric - run this query to see all Traces/Assessments where Faithfulness is "bad."

    <TODO> @Alkis - how are you thinking this would work?  I just made the above up since I wasn't sure.

#. Congrats!  You are now able to investigate WHY your application's quality, cost, or latency is underperforming and develop a hypothesis for how you might fix it.

## Next steps

<TODO> talk about making an eval set