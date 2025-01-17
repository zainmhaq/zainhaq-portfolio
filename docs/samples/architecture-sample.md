---
title: "Cloud Platform Architecture Documentation Sample"
description: "An example of documentation that describes the architecture of a cloud platform."
---

# Cloud Platform Architecture Writing Sample

The following sections describe the architectural concepts behind H2O AI Cloud (HAIC).

## Key concepts

Many types of personas are involved in using AI for business problems. The goal of HAIC is to provide a single platform for these different users to accomplish common use case tasks through the full ML pipeline such as exploring data, building and understanding models, using models in product, and providing model predictions in end user applications.

* **Runtime environment**: HAIC depends on Kubernetes (K8s). K8s is essentially a container orchestrator that organizes containers and ensures that they are able to work together as a cohesive unit.

    * K8s provides a compatibility layer so that HAIC can be run across clouds or on-premise.
    * K8s provides a solid unifying baseline for the runtime.
    * K8s ultimately lets us structure and build HAIC more efficiently.

* **Authentication**: HAIC uses the OpenID Connect (OIDC) standard for authentication and relies on Keycloak as its reference OIDC implementation.
    * Using OIDC lets all services in the cloud use the same identity.
    * If a behavior is initiated in one component of HAIC, an API call can subsequently be forwarded to another component while using the same identity.

* **Focus on APIs**: Individual components in HAIC are loosely coupled and leverage well-defined APIs.

* **Leverages managed Cloud services** to achieve the following:
    * Maximum deployment flexibility.
    * Retains compatibility with on-premises infrastructure or custom deployments.

## High-level overview

HAIC is deployed with Kubernetes, which lets customers run the platform in any cloud or on-premises infrastructure. All of the utility provided by HAIC is contained within a Kubernetes cluster.

![High-level overview of HAIC](architecture.png)

Three distinct workloads are present within the K8s cluster:

* **AI Engine management** (My AI Engines): Managing all running machine learning engines such as H2O-3 and Driverless AI.

* **Model management** (My Models): Managing all existing model deployments.

* **App Store / App management**: Managing all existing Wave app deployments.

In addition to these workloads, several baseline interfaces and dependencies are included as part of the high-level overview:

* **Network ingress**: Some flexibility but also standardization
* **Identity provider**: Keycloak
* **Object storage**: Amazon S3, Azure Blob Storage, or Google Cloud Storage
* **SQL database**: PostgreSQL is used across the board

### HAIC - Fully managed architecture

HAIC - Fully managed features a single tenant per account design, meaning that every customer is provided with a dedicated account that is completely isolated from the accounts of other customers. All client communications are encrypted using TLS 1.2. By default, successful authentication is required for all connections.

## HAIC components

The following sections describe some of the individual components that make up HAIC. Each of these components are deployed into their own Kubernetes namespace, which are all set up in a similar manner (for example, each component has its own network ingress). Keep in mind that while there are many architectural similarities between components, each component also has pieces that are unique to their particular architectural setup. Over time, the goal is to eventually make the architectural setup of each component more uniform.

### Keycloak

Keycloak is an open source identity and access management solution that provides a single sign-on solution for web apps and RESTful web services. HAIC uses Keycloak as an identity broker to authenticate with external OpenID Connect or SAML identity providers. This means that if a customer already has an identity provider, we can use Keycloak as a proxy instead of connecting directly to their identity provider. Keycloak ultimately provides a single identity interface for all H2O services and lets you easily link to other authentication providers.

### App Store

App Store is a turnkey platform that streamlines the process of developing, deploying, and using analytical ML software applications based on the H2O Wave development framework. The App Store server communicates with the Kubernetes API to schedule Wave apps, and it also authorizes and proxies all the traffic that comes through the Wave apps.

From an architectural perspective, App Store can be described as a replicated server that handles the following tasks:

* Handles the Wave app repository (that is, the list of available apps) and displays pictures and metadata related to apps.
* Instantiates those apps as running workloads on Kubernetes using scheduling. Uses Helm as an abstraction layer to communicate with the Kubernetes API.
* After apps are scheduled, they can be described as small containers that run Waved (the Wave server), the application Python code, and HAIC Launcher (a booster binary that ensures that the containers starts and operates correctly).
* Apps are accessed through the router component of the App Store server.
* The App Store server uses the Kubernetes API to store information about running apps. This means that HAIC is unable to distinguish between different methods used for manipulating apps (for example, if an app is started with Helm from the command line), which makes HAIC difficult to break even when different methods for manipulating apps are used. This applies to tasks like starting, updating, and deleting apps.
* The metadata database contains app metadata including locations of relevant icons, how should the app be started, and who owns the app.
* Metadata database (PostgreSQL):
    * Stores app metadata including tags and pointers to Blob Storage.
    * Doesn't store instance metadata.
    * Stores browser session data.
* It uses Blob Storage (S3/Azure Blob Storage/GCS) or Persistent Volume to store the app bundles (that is, `.wave` archives and extracted static app assets including icons and screenshots). Since Blob Storage allows for higher scalability and reliability, it is preferred over Persistent Volume whenever possible.
* Router:
    * Performs instance access authorization.
    * Routes requests to the relevant instance K8s service.
    * Consults scheduler to find the relevant K8s service.
* Scheduler:
    * Manages app instances through Helm client.
    * All instance metadata is stored in K8s API through Helm.
* Wave app instance:
    * 1-pod deployment with `clusterIP` service and optional PVC(s). The pod runs a single generic container with HAIC Launcher as the main process.
    * HAIC Launcher takes care of downloading the app code, installing its dependencies, starting Waved, and starting the app.

### Wave apps

H2O Wave is a software stack for building low-latency real-time web applications and dashboards entirely in Python. Apps developed by H2O.ai can be accessed in the App Store.

#### App dependencies

With the exception of core components like Enterprise Steam, Driverless AI, and MLOps, app dependencies are considered as being external to HAIC. For example, app dependencies can be contained in ClickHouse databases. Developers have the option of injecting pointers to external dependencies with secrets that have been registered with the platform.

### Enterprise Steam (My AI Engines)

Enterprise Steam (My AI Engines) is a service for securely managing and connecting to H2O-3 and Driverless AI on Hadoop and Kubernetes. Enterprise Steam offers security, resource control, and resource monitoring out of the box in a multi-tenant architecture so that organizations can focus on the core of their data science practice. Enterprise Steam enables streamlined adoption of H2O.ai products in a secure manner that complies with company policies.

The Enterprise Steam server communicates with the Kubernetes API to schedule tasks relating to the AI engines, and it also authorizes and proxies all the traffic that comes through those engines.

The following describes Enterprise Steam from an architectural perspective within the context of HAIC:

* The Enterprise Steam server communicates with the Kubernetes API to schedule Driverless AI and H2O-3 instances.
* Implements reverse proxy (via Traefik) to forward/route traffic to DAI and H2O-3.
* Unlike App Store, Enterprise Steam uses Persistent Volume with SQLite to store its metadata, including information about DAI/H2O-3 instances.
* The Enterprise Steam server schedules Driverless AI and H2O-3 instances with direct K8s API calls.
* DAI/H2O-3 instances can be provisioned by Wave apps and end users.

### H2O MLOps (My Models)

H2O MLOps lets you export your Driverless AI experiments and import your Driverless AI and H2O-3 MOJO models into a shared MLOps project for collaboration, management, deployment, and monitoring. MLOps also supports third-party Python models with the Bring Your Own Model (BYOM) feature.

The following describes H2O MLOps from an architectural perspective within the context of HAIC:

* Unlike App Store and Enterprise Steam, H2O MLOps is implemented using microservices architecture.
* H2O MLOps uses gRPC and gRPC-Gateway to expose its APIs to clients.
* H2O MLOps storage uses persistent disk to store its artifacts' blobs while using PostgreSQL for the metadata.
* H2O MLOps uses Grafana and InfluxDB to implement monitoring.
* H2O MLOps can deploy scoring/model endpoints in either the same K8s cluster as the above components or a separate one. This is different from Enterprise Steam and App Store, which can only deploy DAI/apps within the same K8s cluster.
* H2O MLOps uses off-the-shelf reverse-proxy (ambassador) to proxy traffic to scoring/model deployments.
* Driverless AI / H2O-3 models:
    * DAI publishes models to the H2O storage.
    * DAI / H2O-3 models get deployed as REST services.
    * Wave apps can use models deployed by H2O MLOps.
    * Deployed models are invoked by external users/systems. Usage statistics are stored.

### H2O Drive

H2O Drive is an object store—similar to S3—built for H2O AI Managed Cloud. The goal of this API is to provide easy access to blob/object storage for Wave apps and other clients. A key use case is to store data to be used across different app instances and app versions. This allows app users to have access to their past work even if they are in a new instance of the app, or if the app is updated to a new version. Another key use case is exchanging large temporal data files between apps/systems, e.g., app1 -> DAI -> h2o-3 -> app2 (this is where the name comes from).

H2O Drive can be used to store objects like personal files, app inputs, non-structured datasets, app reports, and backups. It has three basic roles:

* End user authentication that is OIDC-based so that it works seamlessly with the rest of the platform.
* A single stable interface into blob storage, regardless of the deployment platform being used (for example, AWS or Azure). This means that individual HAIC components don't have to support every deployment platform.
* When H2O Drive is deployed, each user is given a "home" bucket that they can browse and add content to with the Ocean app. All other apps and services in the cloud can also use this bucket to store and read file objects.

## Understanding shared user identity in HAIC

This section describes how identity is shared across all the components that make up HAIC.

* OIDC is the protocol used for user authentication. Additionally, aspects of the user's OIDC identity are also used for authorization, e.g., group membership.
* A user's identity (OIDC session / token) flows through all the components that make up HAIC. For example, your identity can flow from the App Store server to the Waved server, which then forwards your identity to the app Python code.

The following bullet points are the result of HAIC's standardisation on OIDC:

* Driverless AI or H2O-3 runtimes spawned by users are available for the Apps run by that user.
* Models created by Apps are available in H2O MLOps and Driverless AI.
* User identity can be used to reach out to external resources like data lakes, including corresponding authorization. However, because Keycloak is used as a proxy, communicating with external resources requires additional steps (identity tokens cannot be used directly).
* Driverless AI / H2O-3 runtimes / apps spawned by a user have access to the user's H2O Drive data.
* Note that H2O Drive also fits into this paradigm for shared user identity.
