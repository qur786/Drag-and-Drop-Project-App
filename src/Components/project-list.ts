import  { Component } from "./base-component.js";
import { DropTarget } from "../Models/drag-drop.js";
import { Project, ProjectStatus } from "../Models/project.js";
import { autoBind } from "../Decorator/autobind.js";
import { projectState } from "../State/Project-State.js";
import { ProjectItem } from "./project-item.js";

// ProjectList class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DropTarget {
    assignedProjects: Project[];
    constructor (private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);
        this.assignedProjects = []
        this.configure();
        this.renderContent();
    }

    @autoBind
    DragOverHandler(event: DragEvent): void {
        if ( event.dataTransfer && event.dataTransfer!.types[0] === "text/plain") {
            event.preventDefault();
            const ulist = this.element.querySelector("ul")!;
            ulist.classList.add("droppable");
        }
    }

    @autoBind
    DropHandler(event: DragEvent): void {
        const projectID = event.dataTransfer!.getData("text/plain");
        projectState.moveProject(projectID, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @autoBind
    DragLeaveHandler(event: DragEvent): void {
        const ulist = this.element.querySelector("ul")!;
        ulist.classList.remove("droppable");
    }
    
    private renderProjects() {
        const list = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        list.innerHTML = "";
        for( let project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, project);
        }
    }

    configure() {
        this.element.addEventListener("dragover", this.DragOverHandler);
        this.element.addEventListener("drop", this.DropHandler);
        this.element.addEventListener("dragleave", this.DragLeaveHandler);
        projectState.addListeners((projects: Project[]) => {
            const relevantProjects = projects.filter((el) => {
                if (this.type === "active") {
                    return el.status === ProjectStatus.Active;
                }
                return el.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects(); 
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
    }
}