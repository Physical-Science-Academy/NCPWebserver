package com.cimeyclust.ncpserver;

import cn.nukkit.plugin.PluginBase;
import cn.nukkit.utils.Config;
import net.catrainbow.nocheatplus.NoCheatPlus;

import java.io.IOException;

public class Plugin extends PluginBase {
    private static Plugin instance;
    private NoCheatPlus ncp;
    private Config config;
    private HttpServer server;

    @Override
    public void onLoad() {
        instance = this;
        getLogger().info("NCP Webserver is starting up...");

        // Config
        getLogger().info("Saving and reading config...");
        saveResource("config.yml", false);
        config = new Config(getDataFolder() + "/config.yml", Config.YAML);

        // HTTP Server
        getLogger().info("Starting up HTTP Server...");
        server = new HttpServer(config.getString("hostname"), config.getInt("port"));
        try {
            server.start();
        } catch (IOException e) {
            e.printStackTrace();
            getLogger().error("§cError while starting HTTP Server! Please make sure that the port is not already in use.");
            getLogger().info("§cDisabling NCP Webserver...");
            this.getServer().getPluginManager().disablePlugin(this);
        }
    }

    @Override
    public void onEnable() {
        getLogger().info("Searching for NCP Plugin...");
        if (this.getServer().getPluginManager().getPlugin("NoCheatPlus") == null) {
            getLogger().info("§cNCP Plugin not found! Disabling NCP Webserver...");
            this.getServer().getPluginManager().disablePlugin(this);
        } else {
            getLogger().info("§aNCP Plugin found!");
            ncp = NoCheatPlus.instance;
        }
        getLogger().info("NCP Webserver is now accessible via http://" + config.getString("hostname") + ":" + config.getInt("port"));
    }

    @Override
    public void onDisable() {
        getLogger().info("Stopping HTTP Server...");
        if (server != null) {
            server.stop();
            getLogger().info("§aStopped HTTP Server!");
        }
        getLogger().info("§cNCP Server has been disabled!");
    }

    public NoCheatPlus getNcp() {
        return ncp;
    }

    public Config getConfig() {
        return config;
    }

    public HttpServer getHttpServer() {
        return server;
    }

    synchronized public static Plugin getInstance() {
        return instance;
    }
}
