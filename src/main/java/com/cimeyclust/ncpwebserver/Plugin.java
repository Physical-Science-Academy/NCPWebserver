package com.cimeyclust.ncpwebserver;

import cn.nukkit.plugin.PluginBase;
import cn.nukkit.utils.Config;
import net.catrainbow.nocheatplus.NoCheatPlus;
import net.catrainbow.nocheatplus.checks.Check;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

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

        try {
            InetAddress inetAddress = InetAddress.getByName(config.getString("hostname"));
            getLogger().info("NCP Webserver is now accessible via http://" + inetAddress.getHostAddress() + ":" + config.getInt("port"));
        } catch (UnknownHostException e) {
            e.printStackTrace();
            getLogger().info("The provided hostname could not be resolved!");
            getLogger().info("§cDisabling NCP Webserver...");
            this.getServer().getPluginManager().disablePlugin(this);
        }
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

    public List<Check> getModules() {
        return new ArrayList<>(ncp.getAllNCPCheck().values());
    }

    synchronized public static Plugin getInstance() {
        return instance;
    }
}
