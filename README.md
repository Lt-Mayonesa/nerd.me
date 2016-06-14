# nerd.me

nerd.me is a training project for developping with Ionic, is also a great idea :)

## Project
This project consists in creating a mobile app wich helps me and anyone studie.
The primary idea is that the user creates his own exams (he knows the questions and the answers)
and the app in the specified time (set by the user) asks him via push (or local) notifications a random question from the user's exams.

basic db schema (TODO):
User:
  id (primary)
  name (string)
  age (string)
  exams (many to many)
  
Exam:
  id (primary)
  title (string)
  subject (one to many)
  questions (many to many)
  
Question:
  id (primary)
  text (string)
  answers (one to many)
  correct (answer's id)
