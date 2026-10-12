<?php
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

/**
 * Calculates the fee breakdown from the validated selections.
 */
function calculateFees($days, $hasWorkshop, $hasLunch)
{
    $registrationFee = REGISTRATION_FEE;
    $attendanceFee = $days * ATTENDANCE_FEE_PER_DAY;
    $workshopFee = $hasWorkshop ? WORKSHOP_FEE : 0;
    $mealFee = $hasLunch ? $days * LUNCH_FEE_PER_DAY : 0;
    $subtotal = $registrationFee + $attendanceFee + $workshopFee + $mealFee;

    // 10% discount applies to the whole total when attendance is exactly 3 days
    $discount = ($days === DISCOUNT_DAY_TRIGGER) ? (int) round($subtotal * DISCOUNT_RATE) : 0;

    return [
        'registration' => $registrationFee,
        'attendance' => $attendanceFee,
        'workshop' => $workshopFee,
        'meals' => $mealFee,
        'subtotal' => $subtotal,
        'discount' => $discount,
        'total' => $subtotal - $discount
    ];
}

// --- Only accept POST requests ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: register.html');
    exit;
}

// --- Read submitted values ---
$fullName = getPostValue('fullName');
$admissionNumber = getPostValue('admissionNumber');
$email = getPostValue('email');
$phone = getPostValue('phone');
$yearOfStudy = getPostValue('yearOfStudy');
$category = getPostValue('participationCategory');
$daysRaw = getPostValue('conferenceDays');
$workshop = getPostValue('workshop');
$hasLunch = isset($_POST['lunch']);
$clientTotal = getPostValue('clientTotal');



// --- Server-side validation ---
$errors = [];

if ($fullName === '') {
    $errors[] = 'Full name is required.';
}

if ($admissionNumber === '' || !preg_match('/^[A-Za-z0-9\/]+$/', $admissionNumber)) {
    $errors[] = 'Admission number is invalid.';
}

if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors[] = 'Email address is invalid.';
}

if (!preg_match('/^\d{10}$/', $phone)) {
    $errors[] = 'Phone number must contain exactly 10 digits.';
}

if (!in_array($yearOfStudy, ALLOWED_YEARS, true)) {
    $errors[] = 'Year of study is invalid.';
}

if (!array_key_exists($category, ALLOWED_CATEGORIES)) {
    $errors[] = 'Participation category is invalid.';
}

$days = filter_var($daysRaw, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1, 'max_range' => 3]
]);
if ($days === false) {
    $errors[] = 'Number of conference days must be between 1 and 3.';
    $days = 0;
}

$hasWorkshop = ($category === 'workshopParticipant');
if ($hasWorkshop && !in_array($workshop, ALLOWED_WORKSHOPS, true)) {
    $errors[] = 'Please choose a valid workshop.';
}

// --- Independent fee calculation (never trust the JavaScript total) ---
$fees = calculateFees($days, $hasWorkshop, $hasLunch);

// Compare the amount JavaScript sent, for the demonstration and marking
$totalMismatch = ($clientTotal !== '' && (int) $clientTotal !== $fees['total']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Result | STIC 2026</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="site-header">
        <div class="container nav-bar">
            <a href="index.html" class="brand">STIC 2026</a>
            <nav class="nav-links">
                <a href="index.html">Home</a>
                <a href="register.html">Register</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="result-card">
<?php if (!empty($errors)): ?>
            <!-- Shown when the server rejects the submission -->
            <h1 class="result-error">REGISTRATION NOT COMPLETED</h1>
            <p>The following problems were found:</p>
            <ul class="error-list">
<?php foreach ($errors as $error): ?>
                <li><?= e($error) ?></li>
<?php endforeach; ?>
            </ul>
            <a href="register.html" class="btn btn-primary">Return to registration</a>
<?php else: ?>
            <!-- Shown when every server-side check passes -->
            <h1 class="result-success">REGISTRATION SUCCESSFUL</h1>
            <div class="receipt">
                <p><strong>Participant:</strong> <?= e($fullName) ?></p>
                <p><strong>Admission Number:</strong> <?= e($admissionNumber) ?></p>
                <p><strong>Email:</strong> <?= e($email) ?></p>
                <p><strong>Phone:</strong> <?= e($phone) ?></p>
                <p><strong>Year of Study:</strong> Year <?= e($yearOfStudy) ?></p>
                <p><strong>Participation:</strong> <?= e(ALLOWED_CATEGORIES[$category]) ?></p>
                <p><strong>Conference Days:</strong> <?= e($days) ?></p>
                <p><strong>Workshop:</strong> <?= $hasWorkshop ? e($workshop) : 'Not applicable' ?></p>
                <p><strong>Meals:</strong> <?= $hasLunch ? 'Yes (lunch)' : 'No' ?></p>
            </div>

            <table class="fee-table">
                <tr>
                    <td>Conference registration</td>
                    <td>KSh <?= number_format($fees['registration']) ?></td>
                </tr>
                <tr>
                    <td>Attendance (<?= e($days) ?> day(s))</td>
                    <td>KSh <?= number_format($fees['attendance']) ?></td>
                </tr>
                <tr>
                    <td>Workshop</td>
                    <td>KSh <?= number_format($fees['workshop']) ?></td>
                </tr>
                <tr>
                    <td>Lunch</td>
                    <td>KSh <?= number_format($fees['meals']) ?></td>
                </tr>
                <tr class="discount-row">
                    <td>10% discount</td>
                    <td>- KSh <?= number_format($fees['discount']) ?></td>
                </tr>
                <tr class="total-row">
                    <td>TOTAL AMOUNT PAYABLE</td>
                    <td>KSh <?= number_format($fees['total']) ?></td>
                </tr>
            </table>

<?php if ($totalMismatch): ?>
            <p class="fee-note">The submitted total did not match the server calculation, so the server amount is shown.</p>
<?php endif; ?>

            <p class="thank-you">Thank you for registering for the Student Technology and Innovation Conference.</p>
<?php endif; ?>
        </section>
    </main>

    <footer class="site-footer">
        <p>&copy; 2026 Student Technology and Innovation Conference. All rights reserved.</p>
    </footer>
</body>
</html>
