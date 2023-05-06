package com.cimeyclust.ncpwebserver;

import cn.nukkit.plugin.PluginBase;
import cn.nukkit.utils.Config;
import net.catrainbow.nocheatplus.NoCheatPlus;
import net.catrainbow.nocheatplus.checks.Check;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Files;
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

        // Setting up webapp
        getLogger().info("Webapp is being downloaded and extracted...");
        try {
            downloadAndExtractWebApp(config.getString("download_url"), new File(getDataFolder() + "/webapp"));
        } catch (IOException e) {
            e.printStackTrace();
            // TODO: Add when in production
            // getLogger().info("Download or Unpacking of the webapp failed. Please make sure that \"download_url\" in the config hasn't been modified.");
            // getLogger().info("§cDisabling NCP Webserver...");
            // this.getServer().getPluginManager().disablePlugin(this);
            // return;
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

    public void downloadAndExtractWebApp(String url, File destination) throws IOException {
        File zipFile = new File(destination, "webapp.zip");

        // Download the ZIP file
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(url);
            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    try (InputStream inputStream = entity.getContent()) {
                        Files.copy(inputStream, zipFile.toPath());
                    }
                }
            }
        }

        // Extract the ZIP file to the destination directory
        try (ZipFile zip = new ZipFile(zipFile)) {
            while (zip.getEntries().hasMoreElements()) {
                ZipArchiveEntry entry = zip.getEntries().nextElement();
                File outputFile = new File(destination, entry.getName());

                if (entry.isDirectory()) {
                    outputFile.mkdirs();
                } else {
                    outputFile.getParentFile().mkdirs();
                    try (InputStream inputStream = zip.getInputStream(entry);
                         FileOutputStream outputStream = new FileOutputStream(outputFile)) {
                        byte[] buffer = new byte[4096];
                        int bytesRead;
                        while ((bytesRead = inputStream.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                    }
                }
            }
        }

        // Delete the downloaded ZIP file
        Files.delete(zipFile.toPath());
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
