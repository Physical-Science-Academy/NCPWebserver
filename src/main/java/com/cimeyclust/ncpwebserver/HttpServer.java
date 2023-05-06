package com.cimeyclust.ncpwebserver;

import com.google.gson.Gson;
import fi.iki.elonen.NanoHTTPD;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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
                responseBody = gson.toJson(Plugin.getInstance().getModules());
                break;

            default:
                Response staticFileResponse = serveStaticFiles(session, new File(webapp.getPath()));
                if (staticFileResponse != null) {
                    return staticFileResponse;
                }
        }

        return newFixedLengthResponse(Response.Status.lookup(code), "application/json", responseBody);
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
}
