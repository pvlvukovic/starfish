const validatedPrototype = {
  isRequired() {
    if (!this.value) {
      this.error += `${this.name} is required. `;
    }
  },
  isEmail() {
    if (this.value && !this.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.error += `${this.name} is invalid. `;
    }
  },
  async isUnique(model) {
    if (this.value) {
      const found = await model.collection.findOne({ [this.key]: this.value });
      if (found) {
        this.error += `${this.name} is already taken. `;
      }
    }
  },
  isLength(length) {
    if (this.value && this.value.length !== length) {
      this.error += `${this.name} must be ${length} characters long. `;
    }
  },
  max(max) {
    if (this.value && this.value.length > max) {
      this.error += `${this.name} can have ${max} characters at most. `;
    }
  },
  min(min) {
    if (this.value && this.value.length < min) {
      this.error += `${this.name} must have ${min} characters at least. `;
    }
  },
  hasLowercase() {
    if (this.value && !this.value.match(/[a-z]/)) {
      this.error += `${this.name} must contain a lowercase letter. `;
    }
  },
  hasUppercase() {
    if (this.value && !this.value.match(/[A-Z]/)) {
      this.error += `${this.name} must contain an uppercase letter. `;
    }
  },
  hasNumber() {
    if (this.value && !this.value.match(/\d/)) {
      this.error += `${this.name} must contain a number. `;
    }
  },
  hasSpecial() {
    if (
      this.value &&
      !this.value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    ) {
      this.error += `${this.name} must contain a special character. `;
    }
  },
  isEqual(value) {
    if (this.value && this.value !== value) {
      this.error += `${this.name} must match. `;
    }
  },
  isNumber() {
    if (this.value && isNaN(this.value)) {
      this.error += `${this.name} must be a number. `;
    }
  },
  hasNumberOfDigits(number) {
    if (this.value && this.value.toString().length !== number) {
      this.error += `${this.name} must have ${number} digits. `;
    }
  },
  hasNoSpecial() {
    if (
      this.value &&
      this.value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    ) {
      this.error += `${this.name} must not contain a special character. `;
    }
  },
};

function Validated(value, key, model) {
  // set properties
  this.key = key;
  this.value = value;
  this.error = "";
  // name formed from key
  // check if it's camelCase
  // if so, split it and set first letter to uppercase
  // else set first letter to uppercase
  this.name = key.match(/[A-Z]/)
    ? key
        .split(/(?=[A-Z])/)
        .map((word, index) =>
          index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word.charAt(0).toLowerCase() + word.slice(1)
        )
        .join(" ")
    : key.charAt(0).toUpperCase() + key.slice(1);

  // add prototype methods
  Object.assign(this, validatedPrototype);
}

// check for errors and return 400 or continue
const check = (errors, req, res, next) => {
  // remove empty properties
  Object.keys(errors).forEach((key) => {
    if (!errors[key]) {
      delete errors[key];
    }
  });

  // if there are errors, return 400
  if (Object.keys(errors).length) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // if there are no errors, continue
  next();
};

// exports
module.exports = {
  Validated,
  check,
};
