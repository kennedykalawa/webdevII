# STIC 2026: Conference Registration System

A registration website for the Student Technology and Innovation Conference. Participants choose a package, see their fee update live, and receive a server-checked confirmation.

## Home Page

![Home hero](screenshots/1.png)

Event name, date and venue, with a Register Now button.

![Packages](screenshots/2.png)

The three participation options.

![Call to action](screenshots/3.png)

Closing prompt to register.

## Registration

![Personal details](screenshots/4.png)

Personal details, with the fee summary updating beside the form.

![Participation options](screenshots/5.png)

Participation category, days, lunch and contact details.

![Workshop selected](screenshots/6.png)

Choosing Workshop Participant shows the workshop list.

![Fee summary](screenshots/7.png)

The fee summary with the 10% discount for three days.

## Confirmation

![Confirmation](screenshots/8.png)

Registration details after server validation.

![Confirmation total](screenshots/9.png)

The total is recalculated on the server.

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
