// Project Base Component
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    
    constructor(templateElementID: string, hostElementID: string, insertAtStart: boolean, newElementID?: string) {
        this.templateElement = document.getElementById(templateElementID)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementID)! as T;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as U;
        if (newElementID !== undefined) {
            this.element.id = newElementID;
        }
        this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
        if (insertAtStart === true) {
            this.hostElement.insertAdjacentElement("afterbegin", this.element);
        } else {
            this.hostElement.insertAdjacentElement("beforeend", this.element);
        }
    }

    abstract configure(): void;
    abstract renderContent(): void;
}
