package com.cimeyclust.ncpwebserver.models;

public class Module {
    public String typeName;
    public String baseName;
    public String version;
    public String author;
    public boolean isEnabled;

    public Module(String typeName, String baseName, String version, String author, boolean isEnabled) {
        this.typeName = typeName;
        this.baseName = baseName;
        this.version = version;
        this.author = author;
        this.isEnabled = isEnabled;
    }
}
