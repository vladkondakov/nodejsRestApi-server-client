const lowDb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileSync');

class LowDBOperations {
    static async connect(dbName) { 
        return lowDb(new FileAsync(`../server/database/${dbName}.json`));
    }

    static async getElement(dbName, searchParam) {
        const db = await this.connect(dbName);
        const element = db.get(dbName).find(searchParam).value();
        return element;
    }

    static async getAllElements(dbName) {
        const db = await this.connect(dbName);
        const elements = db.get(dbName).value();
        return elements;
    }

    static async saveElement(dbName, element) {
        const db = await this.connect(dbName);
        await db.get(dbName).push(element).write();
    }

    static async deleteElement(dbName, deleteParam) {
        const db = await this.connect(dbName);
        const elementToDelete = await this.getElement(dbName, deleteParam);
        await db.get(dbName).remove(elementToDelete).write();
    }

    static async pullElement(dbName, element) {
        const db = await this.connect(dbName);
        await db.get(dbName).pull(element).write();
    }

    static async updateElement(dbName, updateParam, element) {
        const db = await this.connect(dbName);
        const existingElement = db.get(dbName).find(updateParam)

        if (!existingElement) {
          return null
        }

        existingElement.assign(element).write();
        const updatedItem = await db.get(dbName).find(updateParam).value()
        return updatedItem || null
    }
}

module.exports = LowDBOperations;