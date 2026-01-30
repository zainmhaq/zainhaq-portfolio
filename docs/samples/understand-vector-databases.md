# Understand vector databases

## Overview

Vector databases store and index data as high-dimensional vectors so you can perform semantic similarity search across unstructured data (for example, text, images, and audio).

Unlike relational databases that rely on exact matching of structured fields, vector databases represent meaningful features and relationships mathematically. This lets you find items that are conceptually similar rather than identical.

Example queries include:

- Find images with similar landscapes to this mountain sunset.
- Locate documents with concepts related to machine learning.

A common application is recommendations, where products can be suggested based on similarity patterns customers might not explicitly search for.

## How vector databases work

Vector databases typically rely on the following processes:

1. Vectorization  
   Embeddings are numerical arrays that represent semantic meaning. Embedding models transform unstructured data into vectors (for example, CLIP for images, GloVe for text, or Wav2vec for audio).

2. Vector representation  
   Each vector has hundreds or thousands of numerical dimensions, each corresponding to features within the data.

3. Vector indexing  
   Indexing algorithms organize vectors for fast retrieval (for example, Hierarchical Navigable Small World (HNSW) or Inverted File Index (IVF)).

4. Semantic similarity search  
   Queries use distance metrics to find related items based on proximity in vector space.

## Benefits of vector databases

- Discover semantically similar content beyond keyword matches
- Fast, large-scale similarity search across billions of vectors
- Support for multiple data types (text, images, audio)
- Enable concept search that traditional databases cannot express well

## Common use cases

- Semantic search engines
- Recommendation systems
- Image recognition
- Anomaly detection
- Retrieval Augmented Generation (RAG), where vector databases store document chunks for relevant information retrieval
