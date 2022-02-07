var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base-component.js";
import { validate } from "../Utils/validation.js";
import { autoBind } from "../Decorator/autobind.js";
import { projectState } from "../State/Project-State.js";
// ProjectInput class
export class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.gatherUserInput = () => {
            const enteredTitle = this.titleInputElement.value;
            const enteredDesc = this.descriptionInputElement.value;
            const enteredPeople = Number.parseFloat(this.peopleInputElement.value);
            const validatableTitle = {
                type: "Title",
                value: enteredTitle,
                required: true,
                minLength: 5,
                maxLength: 30
            };
            const validatableDesc = {
                type: "Description",
                value: enteredDesc,
                required: true,
                minLength: 10,
                maxLength: 50
            };
            const validatablePeople = {
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
            }
            else {
                alert(resultTitle.errorMessage || resultDesc.errorMessage || resultPeople.errorMessage);
            }
        };
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
    }
    renderContent() { }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    handleSubmit(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.handleSubmit);
    }
}
__decorate([
    autoBind
], ProjectInput.prototype, "handleSubmit", null);
//# sourceMappingURL=project-input.js.map