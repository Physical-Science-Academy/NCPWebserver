package com.cimeyclust.ncpserver;

import cn.nukkit.plugin.PluginBase;
import net.catrainbow.nocheatplus.NoCheatPlus;
import net.catrainbow.nocheatplus.components.NoCheatPlusAPI;

public class Plugin extends PluginBase {
    private static Plugin instance;

    public static NoCheatPlus provider;

    @Override
    public void onLoad() {
        instance = this;
        getLogger().info("NCP Webserver is starting up...");
    }

    @Override
    public void onEnable() {
        getLogger().info("Searching for NCP Plugin...");
        if (this.getServer().getPluginManager().getPlugin("NoCheatPlus") == null) {
            getLogger().info("§cNCP Plugin not found! Disabling NCP Webserver...");
            this.getServer().getPluginManager().disablePlugin(this);
        } else {
            getLogger().info("§aNCP Plugin found!");
            provider = NoCheatPlus.instance;
        }
        getLogger().info("NCP Webserver is now accessible via !");
    }

    @Override
    public void onDisable() {
        getLogger().info("NCP Server is disabled!");
    }
}
