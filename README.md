# NCPWebpanel
This simple and effective NCP Extension provides a web interface to manage the No-Cheat-Plus Anticheat on your Minecraft NukkitX server. With this plugin, server administrators can easily monitor and adjust settings for fair gameplay in a Webview without having to deal with manual configuration files.

## Requirements
**To use this plugin you of course will need [No Cheat Plus](https://cloudburstmc.org/resources/nocheatplus.820/) and therefore [KotlinLib](https://cloudburstmc.org/resources/kotlinlib.48/).**

## Install the plugin
Installing NCP Webpanel is made as easy as possible.
Just download the Plugin from the [NukkitX Plugins Page](https://cloudburstmc.org/resources/ncp-webpanel.914/) and put it in your `plugins/` folder.
There you can always find the latest stable version and also the stable version history.

## Setup the Plugin
1. Start the Server after you've completed the previous step.
2. Stop the Server. Open the Plugin configuration (`plugins/NCPWebserver/config.yml`). It should look like this:
```yaml
hostname: 0.0.0.0
port: 8080
username: admin
password: admin
secret: 8833d356-c5b1-44f8-8c74-aa9bad1c5aaa
download_url: https://github.com/Physical-Science-Academy/NCPWebserver/releases/latest/download/webapp.zip
```
3. Change the `port`, `username` and the `password` (and maybe the `hostname`). The port should be free and available on your server.
4. Start your Server again.

**Perfect!** Now the plugin should start up **successfully** and you should be ready to access the panel via the URL, debugged in the console. (If use used `0.0.0.0` as hostname, you need to use the default IP Address of your server.)
