export class Module {
    baseName: string;
    typeName: string;
    author: string;
    version: string;
    isEnabled: boolean;

    constructor(baseName: string, typeName: string, author: string, version: string, isEnabled: boolean) {
        this.baseName = baseName;
        this.typeName = typeName;
        this.author = author;
        this.version = version;
        this.isEnabled = isEnabled;
    }

    public static fromJson(json: any): Module {
        return new Module(json.baseName, json.typeName, json.author, json.version, json.isEnabled);
    }
}