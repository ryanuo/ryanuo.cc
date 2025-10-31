---
title: Docker Basics, Commands, and Key Concepts
categories: docker
date: 2022-01-11 11:17:29
description: learn about docker images containers and repositories underlying principles and common commands
---

[[toc]]

## Docker

### Image

- A template that can be used to create container services.
- Images are immutable and consist of multiple layers.
- Commonly used base images include `ubuntu`, `alpine`, and `node`.

### Container

- Independently runs one or a group of applications, created from an image.
- A simplified Linux system.
- Containers are lightweight and portable, making them ideal for microservices.

### Repository

- A place to store images.
- Divided into public and private repositories.
- Popular public repositories include Docker Hub and GitHub Container Registry.

## Underlying Principles

### How It Works

- A Client-Server structured system, where Docker's daemon runs on the host.
- DockerServer receives commands from Docker-Client.
- Docker uses namespaces for isolation and cgroups for resource management.

### Key Components

- **Docker Daemon**: Runs on the host machine and manages Docker objects.
- **Docker CLI**: A command-line interface to interact with the Docker Daemon.
- **Docker Compose**: A tool for defining and running multi-container applications.

## Commands

### Container

`docker container my_command`
`create` — Create a container from an image.
`start` — Start an existing container.
`run` — Create and start a new container.
`ls` — List running containers.
`inspect` — View detailed information about a container.
`logs` — Print logs.
`stop` — Gracefully stop a running container.
`kill` — Abruptly stop the main process in a container.
`rm` — Remove a stopped container.
`exec` — Run a command inside a running container.
`cp` — Copy files or directories between a container and the host.

### Image

- Use docker `image my_command`
  `build` — Build an image.
  `push` — Push an image to a remote registry.
  `pull` — Download an image from a remote registry.
  `ls` — List images.
  `history` — View intermediate image information.
  `inspect` — View detailed information about an image, including layers.
  `rm` — Remove an image.
  `tag` — Tag an image for easier reference.

### Network

- Use docker `network my_command`
  `create` — Create a new network.
  `ls` — List all networks.
  `inspect` — View detailed information about a network.
  `rm` — Remove a network.
  `connect` — Connect a container to a network.
  `disconnect` — Disconnect a container from a network.

[Docker Syntax](https://juejin.cn/post/6969877845531181086)
