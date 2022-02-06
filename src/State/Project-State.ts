import { Project, ProjectStatus } from "../Models/project.js";

// Project listener Type
export type Listener<T> = (stateList: T[]) => void;

// Project State Management
export class State<T> {
    protected listeners: Listener<T>[] = [];
    addListeners(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

export class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    static getInstance() {
        if (this.instance){
            return this.instance;
        } else {
            return new ProjectState();
        }
    }
    private constructor() {
        super();
    }

    addProject (title: string, description: string, people: number){
        const newProject = new Project(Math.random().toString(),
        title,
        description,
        people,
        ProjectStatus.Active,
        );
        this.projects.push(newProject);
        this.runListeners();
    }

    moveProject (projectID: string, status: ProjectStatus){
        const selectedProject = this.projects.find((project) => project.id === projectID);
        if (selectedProject && selectedProject.status !== status) {
            selectedProject.status = status;
            this.runListeners();
        }
    }

    runListeners() {
        for(const listener of this.listeners) {
            listener(this.projects.slice()); // to pass the copy of the array not the reference
        }
    }
}

export const projectState = ProjectState.getInstance();