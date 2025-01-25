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

<!--
[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=repositoir&layout=compact&theme=radical)](https://github.com/repositoir)

[![Ashutosh's github activity graph](https://github-readme-activity-graph.vercel.app/graph?username=repositoir&theme=github)](https://github.com/ashutosh00710/github-readme-activity-graph)

[![GitHub Streak](https://streak-stats.demolab.com?user=repositoir&theme=highcontrast)](https://git.io/streak-stats)

![Code Snippet](https://carbon.now.sh/some-image-link)

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=4000&color=FF5733&lines=Welcome+to+my+GitHub!;I'm+a+Passionate+Developer;Open+Source+Enthusiast)](https://git.io/typing-svg)

![Metrics](https://github.com/Repositoir/Repositoir/blob/main/github-metrics.svg)

![Jokes Card](https://readme-jokes.vercel.app/api)

![Quote](https://github-readme-quotes.herokuapp.com/quote?theme=dracula&animation=grow_out_in)

![Snake animation](https://github.com/Repositoir/Repositoir/blob/output/github-contribution-grid-snake.svg)

![version](https://img.shields.io/badge/any_text-you_like-bl)
-->