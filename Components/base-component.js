// Project Base Component
export class Component {
    constructor(templateElementID, hostElementID, insertAtStart, newElementID) {
        this.templateElement = document.getElementById(templateElementID);
        this.hostElement = document.getElementById(hostElementID);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementID !== undefined) {
            this.element.id = newElementID;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        if (insertAtStart === true) {
            this.hostElement.insertAdjacentElement("afterbegin", this.element);
        }
        else {
            this.hostElement.insertAdjacentElement("beforeend", this.element);
        }
    }
}
//# sourceMappingURL=base-component.js.map