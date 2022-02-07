var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base-component.js";
import { ProjectStatus } from "../Models/project.js";
import { autoBind } from "../Decorator/autobind.js";
import { projectState } from "../State/Project-State.js";
import { ProjectItem } from "./project-item.js";
// ProjectList class
export class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    DragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const ulist = this.element.querySelector("ul");
            ulist.classList.add("droppable");
        }
    }
    DropHandler(event) {
        const projectID = event.dataTransfer.getData("text/plain");
        projectState.moveProject(projectID, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    DragLeaveHandler(event) {
        const ulist = this.element.querySelector("ul");
        ulist.classList.remove("droppable");
    }
    renderProjects() {
        const list = document.getElementById(`${this.type}-projects-list`);
        list.innerHTML = "";
        for (let project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul").id, project);
        }
    }
    configure() {
        this.element.addEventListener("dragover", this.DragOverHandler);
        this.element.addEventListener("drop", this.DropHandler);
        this.element.addEventListener("dragleave", this.DragLeaveHandler);
        projectState.addListeners((projects) => {
            const relevantProjects = projects.filter((el) => {
                if (this.type === "active") {
                    return el.status === ProjectStatus.Active;
                }
                return el.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent = this.type.toUpperCase() + " PROJECTS";
    }
}
__decorate([
    autoBind
], ProjectList.prototype, "DragOverHandler", null);
__decorate([
    autoBind
], ProjectList.prototype, "DropHandler", null);
__decorate([
    autoBind
], ProjectList.prototype, "DragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map