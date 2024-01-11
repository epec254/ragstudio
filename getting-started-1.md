# Quick start: Deploy a RAG app

The following guide walks you through deploying RAG Studio’s sample application - a Databricks Documentation Q&A bot - as a web application that can collect feedback from your users.

### Step 1: Initialize your development environment

Follow the steps in [Development Environment Setup](env-setup-dev.md) to configure your development environment.

.. note:: The rest of this guide assumes you are using a [local development environment](env-setup-dev.md#local-environment).

### Step 2: Clone the RAG Studio example application

#. Open the terminal on your development machine and change to the directory you want to hold the application’s code base

    ```bash
    mkdir ~/rag_studio
    cd ~/rag_studio
    ```

#. Initialize the sample application using the Asset Bundle template

    ```bash
    databricks bundle init https://github.com/databricks/rag_studio --template-dir templates/getting_started
    ```

    <TODO> Put the right URLs here.

#. Change to the (new) folder `rag-sample-app` inside `~/rag_studio`

    ```bash
    cd rag-sample-app
    ```

### Step 3: Configure the required infrastructure

#. Configure a Databricks Workspace and Unity Catalog schema by following the steps in the [Infrastructure Setup guide](env-setup-infra.md).

### Step 4: Configure the example application to use your infrastructure

In RAG Studio, the RAG application is configured through the `rag_config.yml` file, located inside the `resources` folder.  For more advanced configuration and code customization, please refer to *LINK NEXT TUTORIAL*.

<TODO> Update the link

#. Open `rag_config.yml` in your IDE.

#. Modify the `global_config` section to reference the Workspace and Unity Catalog schema you just configured.

    ```yaml

    global_config:
    ########
    # Required, global configuration
    # These settings are consistent between all Environments
    ########
    
    # User provided name of the application.  Only alphanumeric chars, `_`, or `-`; no spaces.
    name: databricks-docs-bot

    # The workspace where the application is deployed
    workspace_url: https://workspace-name.cloud.databricks.com

    # Unity Catalog location - used for all assets stored within UC.
    unity_catalog:
        catalog: catalog_name
        schema: schema_name
    ```
### Step 5: Deploy the sample application

#. Deploy the application to your workspace by running the following command in your console

    ```bash
    rag create-rag-version -env dev 
    ```

### Step 6: View your RAG application in the Review App

#. Start the Review App by running the following command in your console.

    ```bash
    rag start-review -env dev 
    ```

#. Congrats!  You have deployed a fully functioning RAG application, complete with logging, the ability to collect feedback from users and LLM-Judges, and automated quality/cost/latency metric computation.  

    .. note:: While we are only exploring this application for the purposes of getting started with RAG studio, this application is actually production ready.

#. In the console, you will see output similar to below.  Open the URL in your web browser to open the Review app.

    ```
    [placeholder for some steps/status…]
    View the Review UI at http://link
    ```

<TODO> Make this match whatever we actually dump out in the console

#. You can now interact with the RAG application!

    ![RAG application](/_static/images/rag-studio/review-ui-1.png)

### Step 7: Clean up the application and delete all resources

<TODO> Add this info

## Next steps

View the

* Get feedback - user
* Get feedback - model judge
* View metrics
* Investigate traces

* Build eval set
* Run eval set
* View metrics (see retrieval)

Walk through the end to end
* ingestor
* processor
* retriever
* chain

Create an empty app

Suggested dev workflow
* Build the v1 with our template
* Vibe check 5 - 10 questions manually
* Eval set 10 - 30 questions
* View metrics from judges
* Share it with users
* Recompute metrics
* Investigate
* Make a change

* Repeat

* Deploy to production
* View metrics


Tactical guides - just show you the steps

Explanation guides - explain the concepts