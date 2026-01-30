# Migration Guide Writing Sample

## From 0.67.x to 0.68.0

### (Optional) Vertical Pod Autoscaler (VPA) support

MLOps version 0.68.0 introduces Vertical Pod Autoscaler (VPA) support for the Deployer. Note that VPA activation is optional and performed upon request.
VPA allows dynamic scaling of CPU and memory resources based on application usage, improving resource efficiency and optimizing costs.

If the VPA is activated in MLOps, then VPA is supported in the cluster and the VPA CRDs and controllers are up and running alongside the Metrics Server.

For more information, see the [Installation section of the VPA GitHub README](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#installation) and the [Metrics Server installation instructions](https://github.com/kubernetes-sigs/metrics-server?tab=readme-ov-file#installation).

!!! note

    For a list of known limitations, see the [Known limitations section of the VPA GitHub README](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#known-limitations).

##### Key changes

- VPA Resource Specifications: Added VPA resource specification logic to the Scoring Apps and App Composer, allowing for the dynamic adjustment of their resource limits based on real-time demand.
- API Updates: New API logic has been added for specifying and validating VPA resources.
- New VPA Utility Functions: Implemented utility methods for creating and managing VPA resources, including validation and resource quantity handling.
- Deprecated Function Removal: Removed the deprecated Fabric8 createOrReplace usage in the Scoring Apps.

### Removal of HT runtime based on Python 3.8

The Torch-based (HT) runtime built on Python 3.8, which was available by default in MLOps version 0.67.x, has been removed as of MLOps version 0.68.0. However, you can still use this runtime by registering it through extra runtimes.

The following requirements need to be met so that the runtime registered through extra runtimes is also visible in the UI:

- The `mlflow/flavors/python_function/loader_module` must match `mlflow.pyfunc.model`.
- The runtime name must adhere to this pattern: `(python-scorer_hydrogen_torch_)(\w*)(38)(\w*)`.

### Configure maximum number of Kubernetes replicas

With MLOps v0.68.0, you can configure the maximum number of [Kubernetes replicas](https://kubernetes.io/docs/reference/glossary/?fundamental=true#term-replica) that can be specified when creating a new deployment. To do this, update `maxDeploymentReplicas` in the `values.yaml` file (`charts/mlops/values.yaml`). By default, the `maxDeploymentReplicas` value is set to 5.

### Removal of MLflow runtimes based on Python 3.8

MLflow runtimes based on Python 3.8 have been removed in MLOps version 0.68.0. Python 3.8 has officially reached end of life as of October 07, 2024.

### Pickle runtime based on Python 3.12

MLOps version 0.68.0 introduces a pickle runtime using Python 3.12. Choose one of the following options:

- Update your models to work with Python 3.12.

- If you cannot update your models, the original pickle runtime based on Python 3.8.18 can be configured during MLOps installation by replacing the `pickle-3.12.7` image with `pickle-3.8.18`.

### Scheduler routine for MLOps Telemetry

MLOps version 0.68.0 introduces the `SCHEDULER_INTERVAL_SECONDS` env variable to run scheduler routine inside the application itself, replacing the use of a cron job. As a result, MLOps Telemetry is deployed as a long-running deployment in the K8s cluster that publishes event data at scheduled intervals. The default value is as follows:

```
SCHEDULER_INTERVAL_SECONDS=300
```

### Restructured environment security options 

Environment-related security options are now configured in a different way. Prior to v0.68.0, security options were specified using their corresponding numerical values. For example:

```
securityOptions: [1,2,3]
```

From v0.68.0 onwards, activated security options are configured in the `values.yaml` file (`charts/mlops/values.yaml`) using the security option name. For example:

```
securityOptions:
    activated:
        - .......
        - "AUTHORIZATION_PROTOCOL_OIDC"
        - .......
```

You can also set the default security option in the `values.yaml` file (`charts/mlops/values.yaml`) using the security option name. The default option serves as the default security setting that will be applied in the UI when creating a deployment and it must be a part of the Activated Security Options List. 

```
securityOptions:
    activated:
        - .......
        - "PASSPHRASE_HASH_TYPE_PLAINTEXT"
        - .......
    default: "PASSPHRASE_HASH_TYPE_PLAINTEXT"
```

The following security options are supported in v0.68.0:

- **DISABLED**: No security options are activated.
- **PASSPHRASE_HASH_TYPE_PLAINTEXT**: Passphrase hash type is plaintext.
- **PASSPHRASE_HASH_TYPE_BCRYPT**: Passphrase hash type is bcrypt.
- **AUTHORIZATION_PROTOCOL_OIDC**: OIDC authorization protocol is activated.

!!! note

    - The Activated Security Options List can not be empty.
    - The default option must be part of the Activated Security Options List.

From v0.68.0 onwards, the way to create a deployment with No Security via API call also differs from previous versions. This change includes the following modifications to the `h2o-mlops` Python Client:

- `security_options` is now a required field for the `create_single` method of the `MLOpsScoringDeployments` class.

- To ensure backward compatibility, v0.68.0 includes a new attribute for the `SecurityOptions` class, called `disabled_security`. This attribute allows handling cases with the No Security option by setting it to True, instead of treating None or SecurityOptions() as No Security.

- Users of MLOps assembly v0.68.0 or above must set `disabled_security=True` to use the No Security option. For users on older versions, No Security mode can be accessed by using SecurityOptions with default values.

### Helm changes

- As of version 0.68.0, the `ENABLE_USER_EXTERNALID_UPDATE` environment variable has been removed from storage, as it is no longer necessary.
- `deploymentEnvironment.corsOrigin` has been removed. Use `global.cors.allowedOrigin` instead.

### Default deployment security option

As of version 0.68.0, the default security option for deployment is `PASSPHRASE_HASH_TYPE_PLAINTEXT`. Prior to this version, deployments were not secured by default.

### Cloud migration information: MLOps storage

Starting with version 0.68.0, the MLOps platform will no longer support PVCs for storage, transitioning instead to cloud blob storage. MLOps storage will support blob storage from all three major cloud providers—AWS, Azure, and GCP—as well as Minio for on-premises installations. Consequently, all existing data must be migrated from PVC to blob storage during the upgrade to MLOps 0.68.0. All the data migrations steps will be taken care of by MLOps when MLOps storage is deployed in the MIGRATE mode and no manual user intervention is needed. End users shouldn't experience any down time or data loss while the migration is in progress.

#### Installation instructions

##### Deploy storage in MIGRATE mode

**Note:** Only follow the instructions in this section if MLOps storage was previously deployed with LOCAL mode using a Kubernetes PVC as the storage.

###### For AWS environments with S3

IAM auth is used to access the bucket. Following annotation should be set to the storage service account.

```
eks.amazonaws.com/role-arn: <iam-role-arn>
```

```
storage:
  serviceAccount:
    create: true
    annotations: {
      eks.amazonaws.com/role-arn: <iam-role-arn>
    }
  persistence:
    enabled: true
  cloudPersistence: 
    enabled: true
    url: s3://<bucket-name>?region=<bucket-region>&prefix=<optional-prefix>
  pvcMigration:
    enabled: true
    cloudProvider: s3
    bucketName: <bucket-name>
    region: <bucket-region>
    prefix: <optional-prefix>
```

###### For GCP environments with Google Cloud Storage

Workload identify is used to access the bucket. The following annotation must be set to the storage service account:

```
iam.gke.io/gcp-service-account: <service_account_email>
```

Helm values must be set as follows:

```
storage:
  serviceAccount:
    create: true
    annotations: {
      iam.gke.io/gcp-service-account: <service_account_email>
    }
  persistence:
    enabled: true
  cloudPersistence: 
    enabled: true
    url: gs://<bucket-name>
  pvcMigration:
    enabled: true
    cloudProvider: gcs
    bucketName: <bucket-name>
    region: <bucket-region>
```

###### For Azure environments with Azure Blob Storage

Workload identify is used to access the bucket. The following annotation must be set to the storage service account:

```
azure.workload.identity/client-id=<client-id>
```

The following label must be set to storage pods (service and migrator job):

```
azure.workload.identity/use=true
```

Helm values must be set as follows:

```
storage:
  serviceAccount:
    create: true
    annotations: {
      azure.workload.identity/client-id=<client-id>
    }
  extraPodLabels: {
    azure.workload.identity/use=true
  }
  persistence:
    enabled: true
  cloudPersistence: 
    enabled: true
    url: azblob://<bucket-name>
  pvcMigration:
    enabled: true
    cloudProvider: azureblob
    bucketName: <bucket-name>
    region: <bucket-region>
    accountName: <storage-account-name>
```

###### For on-premise environments with Minio

```
storage:
  persistence:
    enabled: true
  cloudPersistence: 
    enabled: true
    url: s3://<minio-bucket-name>?endpoint=<minio-url>&region=<minio-region>&hostname_immutable=true
    access_key_id: <minio-access-key-id>
    secret_access_key: <minio-secret-access-key>
  pvcMigration:
    enabled: true
    cloudProvider: minio
    bucketName: <bucket-name>
    region: <minio-region>
    endpoint: <minio-url>
    access_key_id: <minio-access-key-id>
    secret_access_key: <minio-secret-access-key>
```

## From 0.66.1 to 0.67.0

### Announcement: Upcoming Java MOJO Runtime removal

The Java MOJO Runtime will be removed in the 0.69.0 MLOps release. Version 0.68.0 will be the last release to include the Java MOJO Runtime.

Users are advised to migrate to the C++ MOJO Runtime, which is a 1:1 mapping of the Java runtime that accepts a wider range of algorithms the AutoML system may use that the Java runtime does not support, including BERT, GrowNet, and TensorFlow models.

### Scoring runtimes

- MLflow Runtimes images are twice as large now. This means that deployments of these run-times can take longer due to longer pulling times.

- Runtimes for DAI 1.10.4.3 and older are removed as of MLOps version 0.67.0.

- MLflow runtimes support Python 3.8 and later starting with MLOps version 0.67.0.

For more information on scoring runtimes in the MLOps platform, see [Scoring runtimes](/deployments/scoring-runtimes.md).

### Python client

Starting with version 0.67.0, the official Python client of the MLOps platform is `mlops-python-client`. The minimum Python version required for the client is Python 3.9.

Built on top of the legacy Python client, `mlops-python-client` retains all previous functionalities. You can continue to access the legacy client's features through `mlops-python-client` as needed. For more information, see [Python client tutorials - Backend](./py-client/tutorials/backend.md).

Note that users of the legacy client can switch to the new Python client (`mlops-python-client`) by importing it before using any features of the legacy client. This switch can be made without needing to modify any existing code or import statements.

### Removal of Conda from Wave app

With the removal of Conda as of MLOps version 0.67.0, third-party models can no longer be uploaded to the MLOps frontend using serialized Pickle files. However, you can still upload models from frameworks like scikit-learn, PyTorch, XGBoost, LightGBM, and TensorFlow using MLflow packaged files.

### Monitoring data retention

- Starting with version 0.67.0, per project data retention duration can be set for monitoring data stored on InfluxDB. To enable this feature, set the `MONITOR_INFLUXDB_PER_PROJECT_DATA_RETENTION_PERIOD` env to the deployer with a correct duration string. Minimum retention period is 1h and the max is `INF`. `INF` will be the default If `MONITOR_INFLUXDB_PER_PROJECT_DATA_RETENTION_PERIOD` is not set, `INF` is the default duration.

 -`monitor_influxdb_per_project_data_retention_period` is exposed for MLOps helm charts to set the `MONITOR_INFLUXDB_PER_PROJECT_DATA_RETENTION_PERIOD` for deployer.

### Emissary

Switch from emissary to [gateway-api](https://gateway-api.sigs.k8s.io/):

	- Emissary's CRDs are no longer used.
	- For mapping deployments to http, Gateway API's HTTPRoute CRD is used.
	- Gateway API implemented with [Envoy Gateway](https://gateway.envoyproxy.io/).
	- (**Breaking change**) Gateway API doesn't support custom error responses. This means that if a deployment is scaled down, the following custom error body is no longer displayed: `Deployment is scaled down to zero replicas. Please increase the number of replicas to use the deployment.` For more information, see [Custom error responses](https://www.getambassador.io/docs/emissary/latest/topics/running/custom-error-responses).
	- (**Breaking change**) - If a deployment is scaled down, error code **500** is thrown instead of **503**.

### Other changes

- External model registry is removed as of version 0.67.0.
