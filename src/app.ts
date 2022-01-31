// Status Type
enum ProjectStatus {
    Active,
    Finished,
}

// Project Type
class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {}
}

// Project listener Type
type ProjectListener = (projects: Project[]) => void;

// Project State Management
class ProjectState {
    private projects: Project[] = [];
    private listeners: ProjectListener[] = [];
    private static instance: ProjectState;

    static getInstance() {
        if (this.instance){
            return this.instance;
        } else {
            return new ProjectState();
        }
    }
    private constructor() {}

    addProject (title: string, description: string, people: number){
        const newProject = new Project(Math.random().toString(),
        title,
        description,
        people,
        ProjectStatus.Active,
        );
        this.projects.push(newProject);
        for(const listener of this.listeners) {
            listener(this.projects.slice()); // to pass the copy of the array not the reference
        }
    }

    addListeners(listenerFn: ProjectListener) {
        this.listeners.push(listenerFn);
    }
}

const projectState = ProjectState.getInstance();

// validatable interface
interface Validatable {
    type: string;
    value: string | number;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
}

interface ValidatableResult {
    success: boolean;
    errorMessage: string;
}

// validation function
const validate = (validatable: Validatable) : ValidatableResult => {
    let success = true;
    let errorMessage = "";
    const { type, value, required, maxLength, minLength, max, min } = validatable;
    if ((value === null || value === undefined || value === "") && required === true) {
        success = false;
        errorMessage = `${type} is a required field.`;
    }
    else if (typeof value === "string" && minLength !== undefined && value.length < minLength) {
        success = false;
        errorMessage = `${type} should be at least ${minLength} characters long.`;
    }
    else if (typeof value === "string" && maxLength !== undefined && value.length > maxLength) {
        success = false;
        errorMessage = `${type} should not be more than ${maxLength} characters.`;
    }
    else if (typeof value === "number" && min !== undefined && value < min) {
        success = false;
        errorMessage = `${type} should be greater than ${min}`;
    }
    else if (typeof value === "number" && max !== undefined && value > max) {
        success = false;
        errorMessage = `${type} should be less than ${max}`;
    }
    return {success, errorMessage};
}

// Autobind decorator
const autoBind = (
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor,
) => {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get (){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}

// ProjectList class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[];
    constructor (private type: "active" | "finished") {
        this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;
        this.assignedProjects = []
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLElement;
        this.element.id = `${this.type}-projects`;
        projectState.addListeners((projects: Project[]) => {
            const relevantProjects = projects.filter((el) => {
                if (this.type === "active") {
                    return el.status === ProjectStatus.Active;
                }
                return el.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects(); 
        })
        this.attach();
        this.renderContent();
    }
    private renderProjects() {
        const list = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        list.innerHTML = "";
        for( let project of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = project.title;
            list.appendChild(listItem);
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
}

// ProjectInput class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    newForm: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor(){
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.newForm = importedNode.firstElementChild! as HTMLFormElement;
        this.newForm.id = "user-input";
        this.titleInputElement = this.newForm.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.newForm.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.newForm.querySelector("#people") as HTMLInputElement;
        this.attach();
        this.configure();
    }

    private gatherUserInput = (): [string, string, number] | void => {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesc = this.descriptionInputElement.value;
        const enteredPeople = Number.parseFloat(this.peopleInputElement.value);
        const validatableTitle: Validatable = {
            type: "Title",
            value: enteredTitle,
            required: true,
            minLength: 5,
            maxLength: 30
        };
        const validatableDesc: Validatable = {
            type: "Description",
            value: enteredDesc,
            required: true,
            minLength: 10,
            maxLength: 50
        };
        const validatablePeople: Validatable = {
            type: "People",
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        const resultTitle = validate(validatableTitle); 
        const resultDesc = validate(validatableDesc);
        const resultPeople = validate(validatablePeople);
        if (resultTitle.success && resultDesc.success && resultPeople.success) {
            return [enteredTitle, enteredDesc, enteredPeople];
        } else {
            alert(resultTitle.errorMessage || resultDesc.errorMessage || resultPeople.errorMessage);
        }
    }

    private clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    @autoBind
    private handleSubmit(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if ( Array.isArray(userInput)) {
            const [ title, desc, people ] = userInput;
            console.log(title, desc, people);
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.newForm.addEventListener("submit", this.handleSubmit);
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.newForm);
    }
}

const newProject = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");