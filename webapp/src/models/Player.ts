export class Player {
    uuid: string;
    name: string;
    banDate?: Date;

    constructor(uuid: string, name: string, banDate?: Date) {
        this.uuid = uuid;
        this.name = name;
        this.banDate = banDate;
    }

    public static fromJson(json: any): Player {
        return new Player(json.uuid, json.name, json.banDate);
    }
}