import { Component } from "./base-component.js";
import { Validatable, validate } from "../Utils/validation.js";
import { autoBind } from "../Decorator/autobind.js";
import { projectState } from "../State/Project-State.js";

// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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