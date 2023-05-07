package com.cimeyclust.ncpwebserver;

import com.cimeyclust.ncpwebserver.models.Module;
import com.google.gson.Gson;
import fi.iki.elonen.NanoHTTPD;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;

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
            case "/modules":
                if (session.getMethod().equals(Method.PATCH) || session.getMethod().equals(Method.PUT)) {
                    Module module = gson.fromJson(getRequestBody(session), Module.class);
                    Plugin.getInstance().getNcp().getComManager().setChecksUsed(module.baseName, module.isEnabled);
                    responseBody = gson.toJson(Plugin.getInstance().getModules());
                } else {
                    responseBody = gson.toJson(Plugin.getInstance().getModules());
                }
                break;

            default:
                Response staticFileResponse = serveStaticFiles(session, new File(webapp.getPath()));
                if (staticFileResponse != null) {
                    return staticFileResponse;
                }
        }

        // TODO: Remove unsafe code in production
        Response response = newFixedLengthResponse(Response.Status.lookup(code), "application/json", responseBody);
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "*");
        response.addHeader("Access-Control-Allow-Headers", "*");
        return response;
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
