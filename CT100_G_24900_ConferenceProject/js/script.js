
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

