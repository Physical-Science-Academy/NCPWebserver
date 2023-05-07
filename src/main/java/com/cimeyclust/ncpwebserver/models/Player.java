package com.cimeyclust.ncpwebserver.models;

import java.sql.Date;

public class Player {
    public String uuid;
    public String name;
    public Date banDate;

    public Player(String uuid, String name, Date banDate) {
        this.uuid = uuid;
        this.name = name;
        this.banDate = banDate;
    }
}
