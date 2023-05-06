export class Module {
    baseName: string;
    typeName: string;
    author: string;
    version: string;

    constructor(baseName: string, typeName: string, author: string, version: string) {
        this.baseName = baseName;
        this.typeName = typeName;
        this.author = author;
        this.version = version;
    }

    public static fromJson(json: any): Module {
        return new Module(json.baseName, json.typeName, json.ncpRegisterCom.author, json.ncpRegisterCom.version);
    }
}