package com.cimeyclust.ncpwebserver.models;

import java.sql.Date;
import java.sql.Timestamp;

public class Player {
    public String uuid;
    public String name;
    public Timestamp banDate;
    public double violationLevel;

    public Player(String uuid, String name, Timestamp  banDate, double violationLevel) {
        this.uuid = uuid;
        this.name = name;
        this.banDate = banDate;
        this.violationLevel = violationLevel;
    }
}
