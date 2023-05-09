package com.cimeyclust.ncpwebserver;

import cn.nukkit.Player;
import cn.nukkit.utils.Config;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.cimeyclust.ncpwebserver.models.BanEntry;
import com.cimeyclust.ncpwebserver.models.Credentials;
import com.cimeyclust.ncpwebserver.models.Module;
import com.google.gson.Gson;
import fi.iki.elonen.NanoHTTPD;
import net.catrainbow.nocheatplus.checks.CheckType;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

public class HttpServer extends NanoHTTPD {
    private Gson gson;
    private final File webapp;

    public HttpServer(String hostname, int port, File webapp) {
        super(hostname, port);
        this.webapp = webapp;
        gson = new Gson();
    }

    @Override
    public Response serve(IHTTPSession session) {
        String responseBody = "";
        int code = 200;
        switch (session.getUri()) {
            case "/login":
                Credentials credentials = gson.fromJson(getRequestBody(session), Credentials.class);
                if (Plugin.getInstance().getConfig().getString("username").equals(credentials.username) &&
                        Plugin.getInstance().getConfig().getString("password").equals(credentials.password)) {
                    Algorithm algorithm = Algorithm.HMAC256(Plugin.getInstance().getConfig().getString("secret"));
                    String token = JWT.create()
                            .withIssuer("ncpwebserver")
                            .sign(algorithm);
                    responseBody = "{\"message\": \"Login successful!\", \"token\": \"" + token + "\"}";
                } else {
                    responseBody = "Invalid username or password!";
                    code = 401;
                }
                break;

            case "/modules":
                if (!isAuthenticated(session)) {
                    code = 401;
                    responseBody = "{\"message\": \"Not authenticated!\"}";
                    break;
                }
                if (session.getMethod().equals(Method.PATCH) || session.getMethod().equals(Method.PUT)) {
                    Module module = gson.fromJson(getRequestBody(session), Module.class);
                    Plugin.getInstance().getNcp().getComManager().setChecksUsed(module.baseName, module.isEnabled);
                    responseBody = gson.toJson(Plugin.getInstance().getModules());
                } else {
                    responseBody = gson.toJson(Plugin.getInstance().getModules());
                }
                break;

            case "/players":
                if (!isAuthenticated(session)) {
                    code = 401;
                    responseBody = "{\"message\": \"Not authenticated!\"}";
                    break;
                }
                responseBody = gson.toJson(Plugin.getInstance().getPlayers());
                break;

            case "/players/ban":
                if (!isAuthenticated(session)) {
                    code = 401;
                    responseBody = "{\"message\": \"Not authenticated!\"}";
                    break;
                }
                if (session.getMethod().equals(Method.POST)) {
                    BanEntry entry = gson.fromJson(getRequestBody(session), BanEntry.class);
                    Optional<Player> player = Plugin.getInstance().getServer().getPlayer(UUID.fromString(entry.uuid));
                    if (player.isPresent())
                        Plugin.getInstance().getNcp().banPlayer(player.get(), entry.days, entry.hours, entry.minutes);
                    else
                        throw new IllegalArgumentException("Player not found");
                    responseBody = gson.toJson(Plugin.getInstance().getPlayers());
                }
                break;

            case "/players/kick":
                if (!isAuthenticated(session)) {
                    code = 401;
                    responseBody = "{\"message\": \"Not authenticated!\"}";
                    break;
                }
                if (session.getMethod().equals(Method.POST)) {
                    BanEntry entry = gson.fromJson(getRequestBody(session), BanEntry.class);
                    Optional<Player> player = Plugin.getInstance().getServer().getPlayer(UUID.fromString(entry.uuid));
                    if (player.isPresent())
                        Plugin.getInstance().getNcp().kickPlayer(player.get(), CheckType.STAFF);
                    else
                        throw new IllegalArgumentException("Player not found");
                    responseBody = gson.toJson(Plugin.getInstance().getPlayers());
                }
                break;

            case "/banned":
                if (!isAuthenticated(session)) {
                    code = 401;
                    responseBody = "{\"message\": \"Not authenticated!\"}";
                    break;
                }
                if (session.getMethod().equals(Method.POST)) {
                    com.cimeyclust.ncpwebserver.models.Player player = gson.fromJson(getRequestBody(session), com.cimeyclust.ncpwebserver.models.Player.class);

                    if (Plugin.getInstance().getNcp().getNCPBanRecord().exists(player.name)) {
                        Config config = Plugin.getInstance().getNcp().getNCPBanRecord();
                        config.remove(player.name);
                        config.save(true);
                    } else
                        throw new IllegalArgumentException("Player not banned");
                }
                responseBody = gson.toJson(Plugin.getInstance().getBannedPlayers());
                break;

            default:
                Response staticFileResponse = serveStaticFiles(session, new File(webapp.getPath()));
                if (staticFileResponse != null) {
                    return staticFileResponse;
                }
        }

        return newFixedLengthResponse(Response.Status.lookup(code), "application/json", responseBody);
    }

    private boolean isAuthenticated(IHTTPSession session) {
        String authHeader = session.getHeaders().get("authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            try {
                Algorithm algorithm = Algorithm.HMAC256(Plugin.getInstance().getConfig().getString("secret"));
                JWT.require(algorithm)
                        .withIssuer("ncpwebserver")
                        .build()
                        .verify(token);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }

    private Response serveStaticFiles(IHTTPSession session, File webapp) {
        String uri = session.getUri();

        if (uri.equals("/")) {
            uri = "/index.html";
        }

        Path filePath = Paths.get(webapp.getPath() + uri);

        if (!filePath.normalize().startsWith(webapp.toPath())) {
            return newFixedLengthResponse(Response.Status.FORBIDDEN, NanoHTTPD.MIME_PLAINTEXT, "Forbidden");
        }

        if (!Files.exists(filePath)) {
            return null;
        }

        try {
            return newChunkedResponse(Response.Status.OK, Files.probeContentType(filePath), Files.newInputStream(filePath));
        } catch (IOException e) {
            e.printStackTrace();
            return newFixedLengthResponse(Response.Status.FORBIDDEN, NanoHTTPD.MIME_PLAINTEXT, "Forbidden");
        }
    }

    public static String getRequestBody(IHTTPSession session) {
        String requestBody = "";
        try {
            // Get the content length from headers
            int contentLength = Integer.parseInt(session.getHeaders().get("content-length"));

            // Read the request body
            byte[] buffer = new byte[contentLength];
            session.getInputStream().read(buffer, 0, contentLength);

            // Convert the request body to a string
            requestBody = new String(buffer, StandardCharsets.UTF_8);
        } catch (NumberFormatException | IOException e) {
            e.printStackTrace();
        }

        return requestBody;
    }
}
