
// --- Fee Rules (keep in sync with js/script.js) ---
const REGISTRATION_FEE = 1000;
const ATTENDANCE_FEE_PER_DAY = 500;
const WORKSHOP_FEE = 750;
const LUNCH_FEE_PER_DAY = 300;
const DISCOUNT_RATE = 0.10;
const DISCOUNT_DAY_TRIGGER = 3;

// --- Allowed Values ---
const ALLOWED_CATEGORIES = [
    'conferenceOnly' => 'Conference Only',
    'workshopParticipant' => 'Workshop Participant'
];
const ALLOWED_YEARS = ['1', '2', '3', '4'];
const ALLOWED_WORKSHOPS = [
    'Web Development',
    'Artificial Intelligence',
    'Cybersecurity',
    'Mobile App Development'
];

/**
 * Returns a trimmed POST value, or an empty string if the field was not sent.
 */
function getPostValue($fieldName)
{
    return isset($_POST[$fieldName]) ? trim($_POST[$fieldName]) : '';
}

/**
 * Escapes output so user input cannot inject HTML.
 */
function e($value)
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}



