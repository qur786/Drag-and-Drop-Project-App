// validation function
export const validate = (validatable) => {
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
    return { success, errorMessage };
};
//# sourceMappingURL=validation.js.map