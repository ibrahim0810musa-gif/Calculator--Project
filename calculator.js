const backspaceButton = document.querySelector(".backspace");
const display = document.querySelector("#display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const clearButton = document.querySelector(".clear");
const equalsButton = document.querySelector(".equals");
const decimalButton = document.querySelector(".decimal");


let justCalculated = false;
let currentInput = "";
let expression = "";
let firstNumber = null;
let selectedOperator = null;
let hasError = false;

// Number buttons

numberButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    if (hasError || justCalculated) {
      currentInput = "";
      expression = "";
      firstNumber = null;
      selectedOperator = null;
      hasError = false;
      justCalculated = false;
    }

    currentInput += button.textContent;
    display.value = expression + currentInput;
  });
});

// Decimal button
decimalButton.addEventListener("click", function() {
  if (justCalculated) {
  currentInput = "";
  expression = "";
  firstNumber = null;
  selectedOperator = null;
  justCalculated = false;
}
  if (currentInput.includes(".")) {
    return;
  }

  if (currentInput === "") {
    currentInput = "0.";
  } else {
    currentInput += ".";
  }

  display.value = expression + currentInput;
});

// Operator buttons
operatorButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    if (hasError || currentInput === "") {
      return;
    }

    const currentNumber = Number(currentInput);

    if (firstNumber === null) {
      firstNumber = currentNumber;
    } else if (selectedOperator !== null) {
      let result;

      switch (selectedOperator) {
        case "+":
          result = firstNumber + currentNumber;
          break;
        case "-":
          result = firstNumber - currentNumber;
          break;
        case "×":
          result = firstNumber * currentNumber;
          break;
        case "÷":
          if (currentNumber === 0) {
            display.value = "Cannot divide by zero";
            hasError = true;
            return;
          }

          result = firstNumber / currentNumber;
          break;
      }

      if (!Number.isFinite(result)) {
        display.value = "Invalid result";
        hasError = true;
        return;
      }

      firstNumber = result;
    }

    selectedOperator = button.textContent;
justCalculated = false;

expression += currentInput + " " + selectedOperator + " ";
currentInput = "";
display.value = expression;
  });
});

// Equals button
equalsButton.addEventListener("click", function() {
  if (
    hasError ||
    currentInput === "" ||
    selectedOperator === null ||
    firstNumber === null
  ) {
    return;
  }

  const secondNumber = Number(currentInput);
  let result;

  switch (selectedOperator) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "×":
      result = firstNumber * secondNumber;
      break;
    case "÷":
      if (secondNumber === 0) {
        display.value = "Cannot divide by zero";
        hasError = true;
        return;
      }

      result = firstNumber / secondNumber;
      break;
  }

  if (!Number.isFinite(result)) {
    display.value = "Invalid result";
    hasError = true;
    return;
  }

  display.value = String(result);

currentInput = String(result);
expression = "";
firstNumber = null;
selectedOperator = null;
justCalculated = true;
});

// Clear button
clearButton.addEventListener("click", function() {
  display.value = "";
  currentInput = "";
  expression = "";
  firstNumber = null;
  selectedOperator = null;
  hasError = false;
  justCalculated = false;
});

backspaceButton.addEventListener("click", function() {
  if (hasError) {
    return;
  }

  currentInput = currentInput.slice(0, -1);
  display.value = expression + currentInput;
});

document.addEventListener("keydown", function(event) {
  let key = event.key;

  // Enter or = calculates the answer
  if (key === "Enter" || key === "=") {
    event.preventDefault();
    equalsButton.click();
    return;
  }

  // Escape clears the calculator
  if (key === "Escape") {
    clearButton.click();
    return;
  }

  // Backspace removes the last typed digit
  if (key === "Backspace") {
    event.preventDefault();

    if (hasError) {
      clearButton.click();
      return;
    }

    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      display.value = expression + currentInput;
    }

    return;
  }

  // A decimal key uses the decimal button
  if (key === ".") {
    decimalButton.click();
    return;
  }

  // Convert keyboard operators to our button symbols
  if (key === "*") {
    key = "×";
  }

  if (key === "/") {
    key = "÷";
  }


  // Find the matching calculator button
  document.querySelectorAll("button").forEach(function(button) {
    if (button.textContent === key) {
      button.click();
    }
  });
});