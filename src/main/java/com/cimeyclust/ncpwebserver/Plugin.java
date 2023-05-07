package com.cimeyclust.ncpwebserver;

import cn.nukkit.plugin.PluginBase;
import cn.nukkit.utils.Config;
import com.cimeyclust.ncpwebserver.models.Module;
import com.cimeyclust.ncpwebserver.models.Player;
import net.catrainbow.nocheatplus.NoCheatPlus;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

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

        // Setting up webapp
        getLogger().info("Webapp is being downloaded and extracted...");
        try {
            setupWebapp(config.getString("download_url"), new File(getDataFolder() + "/webapp"));
        } catch (IOException e) {
            e.printStackTrace();
            getLogger().info("Download or Unpacking of the webapp failed. Please make sure that \"download_url\" in the config hasn't been modified.");
            getLogger().info("§cDisabling NCP Webserver...");
            this.getServer().getPluginManager().disablePlugin(this);
            return;
        }

        // HTTP Server
        getLogger().info("Starting up HTTP Server...");
        server = new HttpServer(config.getString("hostname"), config.getInt("port"), new File(getDataFolder() + "/webapp"));
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
            return;
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

    public void setupWebapp(String url, File destination) throws IOException {
        File file = new File(destination, "webapp.zip");

        // Download the ZIP file
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(url);
            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    try (InputStream inputStream = entity.getContent()) {
                        if (!destination.exists()) {
                            destination.mkdirs();
                        }
                        Files.copy(inputStream, file.toPath());
                    }
                }
            }
        }

        // Extract the ZIP file to the destination directory
        try (ZipFile zipFile = new ZipFile(file, ZipFile.OPEN_READ)) {
            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                Path entryPath = new File(destination, entry.getName()).toPath();
                if (entry.isDirectory()) {
                    Files.createDirectories(entryPath);
                } else {
                    Files.createDirectories(entryPath.getParent());
                    try (InputStream in = zipFile.getInputStream(entry)) {
                        try (OutputStream out = Files.newOutputStream(entryPath.toFile().toPath())) {
                            IOUtils.copy(in, out);
                        }
                    }
                }
            }
        }

        // Delete the downloaded ZIP file
        Files.delete(file.toPath());
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

    public List<Module> getModules() {
        return ncp.getAllNCPCheck().values().stream()
                .map(check -> new Module(
                        check.getTypeName().name(),
                        check.getBaseName(),
                        check.getRegisterCom().getVersion(),
                        check.getRegisterCom().getAuthor(),
                        ncp.getComManager().isUsedChecks(check.getBaseName()))
                )
                .collect(Collectors.toList());
    }

    public List<Player> getPlayers() {
        return ncp.getAllPlayerData().values().stream()
                .map(playerData -> new Player(
                        playerData.getPlayer().getUniqueId().toString(),
                        playerData.getPlayerName(),
                        ncp.getNCPBanRecord().exists(playerData.getPlayerName()) ? Date.valueOf(ncp.getNCPBanRecord().getStringList(playerData.getPlayerName()).get(1)) : null
                ))
                .collect(Collectors.toList());
    }

    synchronized public static Plugin getInstance() {
        return instance;
    }
}
