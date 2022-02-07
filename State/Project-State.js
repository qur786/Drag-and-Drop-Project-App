import { Project, ProjectStatus } from "../Models/project.js";
// Project State Management
export class State {
    constructor() {
        this.listeners = [];
    }
    addListeners(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            return new ProjectState();
        }
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        this.runListeners();
    }
    moveProject(projectID, status) {
        const selectedProject = this.projects.find((project) => project.id === projectID);
        if (selectedProject && selectedProject.status !== status) {
            selectedProject.status = status;
            this.runListeners();
        }
    }
    runListeners() {
        for (const listener of this.listeners) {
            listener(this.projects.slice()); // to pass the copy of the array not the reference
        }
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=Project-State.js.map