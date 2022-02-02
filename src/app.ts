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
type Listener<T> = (stateList: T[]) => void;

// Project State Management
class State<T> {
    protected listeners: Listener<T>[] = [];
    addListeners(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State<Project>{
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
        for(const listener of this.listeners) {
            listener(this.projects.slice()); // to pass the copy of the array not the reference
        }
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

// Project Base Component
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project;
    constructor(hostID: string, project: Project) {
        super("single-project", hostID, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.project.people.toString();
        this.element.querySelector("p")!.textContent = this.project.description;
    }
    
    configure() {}

}

// ProjectList class
    class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[];
    constructor (private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);
        this.assignedProjects = []
        this.configure();
        this.renderContent();
    }
    
    private renderProjects() {
        const list = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        list.innerHTML = "";
        for( let project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, project);
        }
    }

    configure() {
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

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor(){
        super("project-input", "app", true, "user-input")
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;
        this.configure();
    }

    renderContent() {}

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

    configure() {
        this.element.addEventListener("submit", this.handleSubmit);
    }
}

const newProject = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");