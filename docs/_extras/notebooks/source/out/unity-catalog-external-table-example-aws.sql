-- Databricks notebook source
-- MAGIC %md
-- MAGIC # Create an external table in Unity Catalog
-- MAGIC 
-- MAGIC This notebook shows how to create an external table in Unity Catalog from a Delta table in the `samples` catalog. The data for an external table is stored in a path in your cloud tenant's storage, outside the default storage location for a metastore. When you drop an external table, its underlying data is not deleted.
-- MAGIC 
-- MAGIC Before you can create an external table, you must create a storage credential that allows Unity Catalog to read from and write to the path on your cloud tenant, and an external location that references it.

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## Requirements
-- MAGIC 1. In Databricks, find your account ID.
-- MAGIC 
-- MAGIC    a. Log in to the Databricks [account console](https://accounts.cloud.databricks.com).
-- MAGIC   
-- MAGIC    b. Click **User Profile**.
-- MAGIC   
-- MAGIC    c. From the pop-up, copy the value next to **Account ID**.
-- MAGIC   
-- MAGIC 2. In AWS, create an IAM policy that allows reading and writing to the S3 bucket path. In the following policy, replace the following values:
-- MAGIC 
-- MAGIC    - `<BUCKET>`: The name of the S3 bucket from the previous step.
-- MAGIC    - `<KMS_KEY>`: The name of the KMS key that encrypts the S3 bucket contents, if encryption is enabled. **If encryption is disabled, remove the last portion of the IAM policy.**
-- MAGIC 
-- MAGIC    ```json
-- MAGIC    {
-- MAGIC     "Version": "2012-10-17",
-- MAGIC     "Statement": [
-- MAGIC         {
-- MAGIC             "Action": [
-- MAGIC                 "s3:GetObject",
-- MAGIC                 "s3:GetObjectVersion",
-- MAGIC                 "s3:PutObject",
-- MAGIC                 "s3:PutObjectAcl",
-- MAGIC                 "s3:DeleteObject",
-- MAGIC                 "s3:ListBucket",
-- MAGIC                 "s3:PutLifecycleConfiguration",
-- MAGIC                 "s3:GetLifecycleConfiguration",
-- MAGIC                 "s3:GetBucketLocation"
-- MAGIC             ],
-- MAGIC             "Resource": [
-- MAGIC                 "arn:aws:s3:::<BUCKET>/*",
-- MAGIC                 "arn:aws:s3:::<BUCKET>"
-- MAGIC             ],
-- MAGIC             "Effect": "Allow"
-- MAGIC         },
-- MAGIC         {
-- MAGIC             "Action": [
-- MAGIC                 "s3:GetObject",
-- MAGIC                 "s3:GetObjectVersion",
-- MAGIC                 "s3:ListBucket",
-- MAGIC                 "s3:GetBucketLocation"
-- MAGIC             ],
-- MAGIC             "Resource": [
-- MAGIC                 "arn:aws:s3:::databricks-datasets-oregon/*",
-- MAGIC                 "arn:aws:s3:::databricks-datasets-oregon"
-- MAGIC             ],
-- MAGIC             "Effect": "Allow"
-- MAGIC         },
-- MAGIC         {
-- MAGIC             "Action": [
-- MAGIC                 "kms:Decrypt",
-- MAGIC                 "kms:Encrypt",
-- MAGIC                 "kms:GenerateDataKey*"
-- MAGIC             ],
-- MAGIC             "Resource": [
-- MAGIC                 "arn:aws:kms:<KMS_KEY"
-- MAGIC             ],
-- MAGIC             "Effect": "Allow"
-- MAGIC         }
-- MAGIC       ]
-- MAGIC    }
-- MAGIC    ```
-- MAGIC    
-- MAGIC 3. Create an IAM role that uses the IAM policy you created in the previous step.
-- MAGIC 
-- MAGIC    a. Set **EC2** as the trusted entity.
-- MAGIC    
-- MAGIC    b. In the Role’s **Permission** tab, attach the IAM Policy you just created.
-- MAGIC    
-- MAGIC    c. Set up a cross-account trust relationship so that Unity Catalog can assume the role to access the data in the bucket on the behalf of Databricks users by pasting the following policy JSON into the **Trust Relationship** tab.
-- MAGIC 
-- MAGIC       Do not modify the role ARN in the `Principal` section, which is a static value that references a role created by Databricks.
-- MAGIC 
-- MAGIC       In the `sts:ExternalId` section, replace `<DATABRICKS_ACCOUNT_ID>` with your Databricks account ID from the first step (not your AWS account ID).
-- MAGIC       
-- MAGIC 
-- MAGIC         ```json
-- MAGIC         {
-- MAGIC           "Version": "2012-10-17",
-- MAGIC           "Statement": [
-- MAGIC             {
-- MAGIC               "Effect": "Allow",
-- MAGIC               "Principal": {
-- MAGIC                 "AWS": "arn:aws:iam::414351767826:role/unity-catalog-prod-UCMasterRole-14S5ZJVKOTYTL"
-- MAGIC                },
-- MAGIC                "Action": "sts:AssumeRole",
-- MAGIC                "Condition": {
-- MAGIC                 "StringEquals": {
-- MAGIC                   "sts:ExternalId": "<DATABRICKS_ACCOUNT_ID>"
-- MAGIC                 }
-- MAGIC               }
-- MAGIC             }
-- MAGIC           ]
-- MAGIC         }
-- MAGIC         ```

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## Create a storage credential
-- MAGIC 
-- MAGIC You can create a storage credential using the Databricks SQL Catalog Explorer or the Unity Catalog CLI. Follow these steps to create a storage credential using the Catalog Explorer.
-- MAGIC 
-- MAGIC 1. In a new browser tab, log in to Databricks.
-- MAGIC 2. In the sidebar, set the persona to SQL.
-- MAGIC 3. Click **Data**.
-- MAGIC 4. Click **Storage Credentials**.
-- MAGIC 5. Click **Create Credential**.
-- MAGIC 6. Enter **example_credential** for the name of the storage credential.
-- MAGIC 7. Set **IAM role (ARN)** to the IAM role you just created.
-- MAGIC 8. Optionally enter a comment for the storage credential.
-- MAGIC 9. Click **Save**.
-- MAGIC 
-- MAGIC Leave this browser open for the next steps.

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## Create an external location
-- MAGIC An external location references a storage credential and also contains a storage path on your cloud tenant. The external location allows reading from and writing to only that path and its child directories. You can create an external location from the Databricks SQL Catalog Explorer, a SQL command, or the Unity Catalog CLI. Follow these steps to create an external location using the Catalog Explorer.
-- MAGIC 
-- MAGIC 1. Go to the browser tab where you just created a storage credential.
-- MAGIC 2. Click **Data**.
-- MAGIC 3. Click **External Locations**.
-- MAGIC 4. Click **Create location**.
-- MAGIC 5. Enter **example_location** for the name of the external location.
-- MAGIC 6. Enter the S3 bucket path the location allows reading from or writing to.
-- MAGIC 7. Set **Storage Credential** to **example_credential**, the storage credential you just created.
-- MAGIC 8. Optionally enter a comment for the external location.
-- MAGIC 9. Click **Save**.

-- COMMAND ----------

-- Grant access to create tables in the external location
GRANT USE CATALOG
ON example_catalog,
   example_catalog.example_schema
TO `all users`;

GRANT USE SCHEMA
ON example_catalog.example_schema
TO `all users`;

GRANT CREATE EXTERNAL TABLE
ON LOCATION example_location
TO `all users`;

-- COMMAND ----------

-- Create an example catalog and schema to contain the new table
CREATE CATALOG IF NOT EXISTS example_catalog;
USE CATALOG example_catalog;
CREATE SCHEMA IF NOT EXISTS example_schema;
USE example_schema;

-- COMMAND ----------

-- Create a new external Unity Catalog table from an existing table
-- Replace <bucket_path> with the storage location where the table will be created
CREATE TABLE IF NOT EXISTS trips_external
LOCATION 's3://<bucket_path>'
AS SELECT * from samples.nyctaxi.trips;

-- To use a storage credential directly, add 'WITH (CREDENTIAL <credential_name>)' to the SQL statement.

-- COMMAND ----------

-- Describe the new table
DESCRIBE TABLE EXTENDED trips_external;

-- COMMAND ----------

-- Select from the new table
SELECT * from example_catalog.example_schema.trips_external;

-- COMMAND ----------

-- Drop the table. The underlying data files are not removed from cloud storage.
DROP TABLE IF EXISTS trips_external;
