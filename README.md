# STIC 2026: Conference Registration System

A registration website for the Student Technology and Innovation Conference. Participants choose a package, see their fee update live, and receive a server-checked confirmation.

## Home Page

![Home hero](screenshots/01-home-hero.png)

![Participation options](screenshots/02-home-options.png)

## Registration

The form has personal details and participation options. The fee summary updates as the participant changes any option.

![Registration form](screenshots/03-register-form.png)

Choosing **Workshop Participant** reveals the workshop list and updates the package description.

![Workshop selected](screenshots/04-workshop-selected.png)

![Fee summary](screenshots/05-fee-summary.png)

## Confirmation

After validation, `process.php` recalculates the fee on the server and shows the receipt.

![Confirmation](screenshots/06-confirmation.png)

## Fees

| Item | Charge |
|------|--------|
| Registration | KSh 1,000 |
| Attendance | KSh 500 per day |
| Workshop | KSh 750 |
| Lunch | KSh 300 per day |
| 3-day discount | 10% off the total |

## Project Structure

```
index.html        Home page
register.html     Registration form
process.php       Server validation and confirmation
css/style.css     Styles
js/script.js      Live fee calculation and validation
screenshots/      Images used in this README
```

## Running It

1. Start Apache in XAMPP.
2. Put the project in `htdocs`, or link it there.
3. Open `http://localhost/CT100_G_24900_24_ConferenceProject/index.html`.

Full technical details are in `PROJECT_EXPLANATION.md`.
