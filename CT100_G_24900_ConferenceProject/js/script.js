
// --- Fee Rules (keep in sync with process.php) ---
const FEES = {
  registration: 1000,
  attendancePerDay: 500,
  workshop: 750,
  lunchPerDay: 300
};
const DISCOUNT_RATE = 0.10;       // 10% discount
const DISCOUNT_DAY_TRIGGER = 3;   // applies when attendance is exactly 3 days
const MIN_DAYS = 1;
const MAX_DAYS = 3;

// --- Element References ---
const form = document.getElementById('registrationForm');
const categoryRadios = document.querySelectorAll('input[name="participationCategory"]');
const workshopSection = document.getElementById('workshopSection');
const workshopSelect = document.getElementById('workshopSelect');
const daysInput = document.getElementById('conferenceDays');
const lunchCheckbox = document.getElementById('lunchOption');
const packageMessage = document.getElementById('packageMessage');
const resetButton = document.getElementById('resetButton');
const clientTotalInput = document.getElementById('clientTotal');

// --- Helper Functions ---

/** Formats a number as "KSh 3,350". */
function formatKsh(amount) {
  return 'KSh ' + amount.toLocaleString('en-US');
}

/** Returns the value of the checked participation category, or '' if none. */
function getSelectedCategory() {
  const checked = document.querySelector('input[name="participationCategory"]:checked');
  return checked ? checked.value : '';
}

/** Returns the number of days if it is a whole number from 1 to 3, otherwise 0. */
function getValidDays() {
  const days = Number(daysInput.value);
  return Number.isInteger(days) && days >= MIN_DAYS && days <= MAX_DAYS ? days : 0;
}

/** Writes an error message into the span with the given id. */
function showError(errorId, message) {
  document.getElementById(errorId).textContent = message;
}

/** Clears every error message on the page. */
function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(span => {
    span.textContent = '';
  });
}

/**
 * Shows an error when the check fails, clears it when it passes.
 * Returns the result so validateForm() can collect it.
 */
function checkField(errorId, isValid, message) {
  showError(errorId, isValid ? '' : message);
  return isValid;
}

// --- Dynamic Behaviour (no page reload) ---

/** Shows the workshop dropdown only for Workshop Participant and enables it. */
function toggleWorkshopOptions() {
  const isWorkshop = getSelectedCategory() === 'workshopParticipant';
  workshopSection.classList.toggle('hidden', !isWorkshop);
  workshopSelect.disabled = !isWorkshop;

  // Clear a previous workshop choice when the category no longer needs one
  if (!isWorkshop) {
    workshopSelect.value = '';
  }
}

/** Displays a message describing the package the participant has chosen. */
function showPackageMessage() {
  const messages = {
    conferenceOnly: 'Package selected: Conference Only. Full access to keynotes, exhibitions and student showcases.',
    workshopParticipant: 'Package selected: Workshop Participant. Conference access plus one hands-on workshop.'
  };
  packageMessage.textContent = messages[getSelectedCategory()] || 'Select a participation category to see your package.';
}

// --- Fee Calculator ---

/**
 * Calculates the total payable from the current selections and updates the fee summary.
 * Total = Registration + Attendance + Workshop + Meals, less 10% when attendance is 3 days.
 */
function calculateFee() {
  const category = getSelectedCategory();
  const days = getValidDays();
  const hasWorkshop = category === 'workshopParticipant';
  const hasLunch = lunchCheckbox.checked;

  const registrationFee = category ? FEES.registration : 0;
  const attendanceFee = days * FEES.attendancePerDay;
  const workshopFee = hasWorkshop ? FEES.workshop : 0;
  const mealFee = hasLunch ? days * FEES.lunchPerDay : 0;
  const subtotal = registrationFee + attendanceFee + workshopFee + mealFee;
  const discount = days === DISCOUNT_DAY_TRIGGER ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const total = subtotal - discount;

  document.getElementById('feeRegistration').textContent = formatKsh(registrationFee);
  document.getElementById('feeAttendance').textContent = formatKsh(attendanceFee);
  document.getElementById('feeWorkshop').textContent = formatKsh(workshopFee);
  document.getElementById('feeMeals').textContent = formatKsh(mealFee);
  document.getElementById('feeDiscount').textContent = '- ' + formatKsh(discount);
  document.getElementById('feeTotal').textContent = formatKsh(total);

  // Store the total so process.php can compare it with its own calculation
  clientTotalInput.value = total;
  return total;
}


// --- Validation Functions ---

function validateFullName() {
  const value = document.getElementById('fullName').value.trim();
  return checkField('fullNameError', value !== '', 'Full name cannot be empty.');
}

function validateAdmissionNumber() {
  const value = document.getElementById('admissionNumber').value.trim();
  const isValid = /^[A-Za-z0-9\/]+$/.test(value);
  return checkField('admissionNumberError', isValid, 'Enter a valid admission number, e.g. CT100/G/24900/24.');
}

function validateEmail() {
  const value = document.getElementById('email').value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return checkField('emailError', isValid, 'Enter a valid email address, e.g. name@example.com.');
}

function validatePhone() {
  const value = document.getElementById('phone').value.trim();
  const isValid = /^\d{10}$/.test(value);
  return checkField('phoneError', isValid, 'Phone number must contain exactly 10 digits.');
}

function validateYearOfStudy() {
  const value = document.getElementById('yearOfStudy').value;
  return checkField('yearOfStudyError', value !== '', 'Please select your year of study.');
}

function validateCategory() {
  return checkField('participationCategoryError', getSelectedCategory() !== '', 'Please select a participation category.');
}

function validateDays() {
  const isValid = getValidDays() > 0;
  return checkField('conferenceDaysError', isValid, 'Number of conference days must be between 1 and 3.');
}

function validateWorkshop() {
  // Only required when the workshop dropdown is visible and enabled
  const needed = getSelectedCategory() === 'workshopParticipant';
  const isValid = !needed || workshopSelect.value !== '';
  return checkField('workshopError', isValid, 'Please choose a workshop.');
}

/**
 * Runs every check. Each function runs even if an earlier one fails,
 * so the participant sees all their errors at once.
 */
function validateForm() {
  const results = [
    validateFullName(),
    validateAdmissionNumber(),
    validateEmail(),
    validatePhone(),
    validateYearOfStudy(),
    validateCategory(),
    validateDays(),
    validateWorkshop()
  ];
  return results.every(Boolean);
}

// --- Event Listeners ---

// onchange: category radio buttons change the workshop section, package message and fee
categoryRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    toggleWorkshopOptions();
    showPackageMessage();
    validateCategory();
    validateWorkshop();
    calculateFee();
  });
});

// oninput: typing a number of days updates the fee immediately
daysInput.addEventListener('input', () => {
  validateDays();
  calculateFee();
});

// onchange: choosing a workshop or lunch updates the fee
workshopSelect.addEventListener('change', () => {
  validateWorkshop();
  calculateFee();
});

lunchCheckbox.addEventListener('change', () => {
  calculateFee();
});

// onsubmit: block submission until every field is valid
form.addEventListener('submit', (event) => {
  calculateFee();
  if (!validateForm()) {
    event.preventDefault();
    alert('Please correct the highlighted fields before submitting.');
  }
});

// onclick: the Clear Form button resets the form and restores the default display
resetButton.addEventListener('click', () => {
  form.reset();
  clearAllErrors();
  toggleWorkshopOptions();
  showPackageMessage();
  calculateFee();
});

// --- Initial Setup (handles browsers that restore old form values on reload) ---
toggleWorkshopOptions();
showPackageMessage();
calculateFee();
