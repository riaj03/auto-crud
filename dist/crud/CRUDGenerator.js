"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRUDGenerator = void 0;
class CRUDGenerator {
    constructor(porjectDBPath, model, CRUDGeneratorStrategy) {
        this.porjectDBPath = porjectDBPath;
        this.CRUDGeneratorStrategy = CRUDGeneratorStrategy;
        this.model = model;
    }
    generate() {
        return this.CRUDGeneratorStrategy.makeRest(this.porjectDBPath, this.model);
    }
}
exports.CRUDGenerator = CRUDGenerator;
