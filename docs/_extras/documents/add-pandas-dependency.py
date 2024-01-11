%pip install pyyaml mlflow-skinny

import os
import shutil
import yaml
import tempfile
import mlflow
from mlflow.tracking import MlflowClient

# use the run_id of the mlflow run that logged the model
run_id = "xxxxxxxxxxxxxxxxxx"

# setup local dir for downloading the artifacts
tmp_dir = str(tempfile.TemporaryDirectory())
os.makedirs(tmp_dir)

# fix conda.yaml
conda_file_path = mlflow.artifacts.download_artifacts(artifact_uri = f"runs:/{run_id}/model/conda.yaml", dst_path=tmp_dir)
with open(conda_file_path) as f:
  conda_libs = yaml.load(f, Loader=yaml.FullLoader)
pandas_lib_exists = any([lib.startswith("pandas==") for lib in conda_libs["dependencies"][-1]["pip"]])
client = MlflowClient()
if not pandas_lib_exists:
  print("Adding pandas dependency to conda.yaml")
  conda_libs["dependencies"][-1]["pip"].append("pandas==1.5.3")

  with open(f"{tmp_dir}/conda.yaml", "w") as f:
    f.write(yaml.dump(conda_libs))
  client.log_artifact(run_id=run_id, local_path=conda_file_path, artifact_path="model")

# fix requirements.txt
venv_file_path = mlflow.artifacts.download_artifacts(artifact_uri = f"runs:/{run_id}/model/requirements.txt", dst_path=tmp_dir)


with open(venv_file_path) as f:
  venv_libs = f.readlines()
venv_libs = [lib.strip() for lib in venv_libs]
pandas_lib_exists = any([lib.startswith("pandas==") for lib in venv_libs])
if not pandas_lib_exists:
  print("Adding pandas dependency to requirements.txt")
  venv_libs.append("pandas==1.5.3")

  with open(f"{tmp_dir}/requirements.txt", "w") as f:
    f.write("\n".join(venv_libs))
  client.log_artifact(run_id=run_id, local_path=venv_file_path, artifact_path="model")

shutil.rmtree(tmp_dir)