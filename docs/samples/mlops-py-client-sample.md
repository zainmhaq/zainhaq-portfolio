# MLOps Python Client Writing Sample

This page describes how to use the H2O MLOps Python client to manage hardware costs by scaling down a deployment when it's not in use.

1. Connect to H2O MLOps.

    ```python
    import h2o_mlops
    import time

    mlops = h2o_mlops.Client()
    ```

2. Retrieve a deployment and view its Kubernetes options.

    ```python
    project = mlops.projects.list()[0]
    environment = project.environments.list()[0]
    deployment = environment.deployments.list()[0]

    print(deployment.kubernetes_options)
    ```

    **Output:**

    ```python
    replicas: 1
    requests: {'cpu': '1', 'memory': '1Gi'}
    limits: {}
    affinity: 
    toleration: 
    ```

3. The following example demonstrates how to scale down to 0 replicas so that no hardware resources are used by the deployment. When completely scaled down, replicas will always display -1.

    ```python
    deployment.update_kubernetes_options(
        replicas=0
    )

    print(deployment.kubernetes_options)
    ```

    **Output:**

    ```python
    replicas: -1
    requests: {'cpu': '1', 'memory': '1Gi'}
    limits: {}
    affinity: 
    toleration: 
    ```

4. Confirm that the update is complete by checking if the deployment is "healthy" (note that a deployment scaled down to 0 replicas is still considered "healthy"). Then for demonstration purposes, try connecting to one of the deployment endpoints using the `get_capabilities` method. This returns an HTTP error as the deployment is now completely scaled down.

    ```python
    while not deployment.is_healthy():
        deployment.raise_for_failure()
        time.sleep(5)

    try:
        deployment.get_capabilities()
    except Exception as e:
        print(e)
    ```

    **Output:**

    ```python
    Server error '504 Gateway Timeout' for url 'https://model.internal.dedicated.h2o.ai/1bde3840-8076-4945-b77a-e0844487f2f2/model/capabilities'
    For more information check: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
    ```

5. Scale back up and confirm that the endpoints are working again by using the `get_capabilities` method.

    **Input:**

    ```python
    deployment.update_kubernetes_options(
        replicas=1
    )

    print(deployment.kubernetes_options)
    ```

    **Output:**

    ```python
    replicas: 1
    requests: {'cpu': '1', 'memory': '1Gi'}
    limits: {}
    affinity: 
    toleration: 
    ```

    **Input:**

    ```python
    while not deployment.is_healthy():
        deployment.raise_for_failure()
        time.sleep(5)
        
    deployment.get_capabilities()
    ```

    **Output:**

    ```python
    ['SCORE', 'CONTRIBUTION_ORIGINAL', 'CONTRIBUTION_TRANSFORMED']
    ```
