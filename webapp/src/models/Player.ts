export class Player {
    uuid: string;
    name: string;
    violationLevel: number;
    banDate?: Date;


    constructor(uuid: string, name: string, violationLevel: number, banDate?: Date) {
        this.uuid = uuid;
        this.name = name;
        this.violationLevel = violationLevel;
        this.banDate = banDate;
    }

    public static fromJson(json: any): Player {
        return new Player(json.uuid, json.name, json.violationLevel, json.banDate);
    }
}