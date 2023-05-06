package com.cimeyclust.ncpwebserver;

import com.google.gson.Gson;
import fi.iki.elonen.NanoHTTPD;

public class HttpServer extends NanoHTTPD {
    private Gson gson;

    public HttpServer(String hostname, int port) {
        super(hostname, port);
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
                code = 404;
                responseBody = "{\"error\":\"404 Not Found\"}";
        }

        return newFixedLengthResponse(Response.Status.lookup(code), "application/json", responseBody);
    }
}

class Modules {

}
