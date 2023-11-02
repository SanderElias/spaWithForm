# Spa with form

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0-rc.3.

As the assessment said, use latest tech, I created this form sample program with a full signals implementation. As not all of Angular is ready for this I had to create a couple of helpers that can be removes once support in the framework is there. It should be very similar to the upcoming forms implementation.


I did skip on writing tests, as I felt that wouldn't really add value to this POC, and also because the way apps are tested are wildly different between teams and projects. But even more so, because I would rather wait with writing tests until de upcoming schematics for 
web with Web Test Runner, a browser-based unit test runner, moves to stable. 

When there are any questions about the code, I'm available to explain everything I have done. I used a lot of different techniques, where in an production application you should stick with one way to do things. I did this on purpose, to show that I can support multiple paradigms and solutions paths.

I did follow most of the best practices currently available, and used some of the upcoming best-practices that I'm still discussing with the Angular team. All the signal stuff is new, and I'm helping the community in trailblazing what will work as best practices in this area.
I usually provide teams I work with with some additional best practices, in addition to what the Angular team has documented. 


The project is set up in such a way that it is ready for SSR. In its current form, there is no additional benefit for SSR, so I didn't fully implement the server part.


For styling I used Open-Props. It gives a good base-line, and is very hands-off. I styled the rest of the app with some basic CSS. I prefer CSS because its one less build step. 
