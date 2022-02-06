import { Component } from "./base-component.js";
import { Draggable } from "../Models/drag-drop.js";
import { Project } from "../Models/project.js";
import { autoBind } from "../Decorator/autobind.js";

// ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;
    get people() {
        return this.project.people === 1 ? `1 people assigned` : `${this.project.people} people assigned`;
    }
    constructor(hostID: string, project: Project) {
        super("single-project", hostID, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.people;
        this.element.querySelector("p")!.textContent = this.project.description;
    }
    
    @autoBind
    DragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData("text/plain", this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    DragEndHandler(event: DragEvent): void {
        console.log("Drag end");
    }
    configure() {
        this.element.addEventListener("dragstart", this.DragStartHandler);
        this.element.addEventListener("dragend", this.DragEndHandler);
    }

}