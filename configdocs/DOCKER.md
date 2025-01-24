# Docker Notes

NovaScript now has an official public Docker Image
to enable cross-platform execution.

--- 

## [v0.2.0 on Docker Hub](https://hub.docker.com/repository/docker/aritrabb/novascript/general)

---
## Running the Image

To run the Docker Image ensure you have Docker version
`23.0.0` or greater.

1. First, pull the image from Docker Hub

```shell
docker pull aritrabb/novascript:0.2.0
```

> [!CAUTION]
> Do NOT use the `aritrabb/novascript:latest` or the
> default `aritrabb/novascript` tag for the image as
> latest tag does not exist on public Docker Image as 
> of `v0.2.0`.

2. Run the Docker Image and pass a NovaScript file 
as a system argument.

```shell
docker run aritrabb/novascript:0.2.0 filename.nv
```

3. Have fun playing with NovaScript!

