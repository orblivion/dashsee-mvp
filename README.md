# Dashsee

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.2.

**Angular Instructions** should hopefully get this up and running for you. It is likely not changed much if at all from Angular's vanilla instructions.

If you're developing, you may want to peek at **Development Notes** below.

# Angular Instructions:

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Development Notes

## File Layout

The source starts out as a standard Angular app. The base is in `src/`. There's probably nothing notable in this base directory. `src/app/` contains most of the application-specific code, so we'll assume that to be our base directory for this discussion.

### Components

#### App

Header icon, Search bar (that doesn't do anything as of this writing), Sign Up / Log In buttons (that don't really do anything as of this writing).

Whatever the router points to goes into router-outlet. Usual Angular stuff.

#### Video

Given a URI, this should display the video and some channel info, or an error.

#### Video List

Given parameters, it will return search results of videos.

It will be paginated: A fixed maximum number of pages will load, and it will a button to load the next page.

Currently the only input parameter to this component is ordering: trending vs latest. However this will probably be overloaded in the future to list the videos belonging to a channel.

#### Home Page

What shows up at the root URL. It contains a video list and a switch to choose whether to return videos by trending vs latest.

### Services

#### Video Service

A library calling out to LBRY's unauthenticated API. Searching for videos, getting them, etc.

## TODO

Some notes of things that have been gathered as this MVP has been developed. Fix along the way, and/or make them a Dash Incubator item.

### Later:

#### Video Component: update the URL bar before we get the stream URL

We know what the URL should be before we get the stream URL. We may as well update it (see `updateUrl`) sooner.

#### Video Component: Make the "Not a video" still show metadata.

Some media links point to a non-video file. We don't show anything, but maybe we could show who/what it even is at least.

#### Routing: Enforce that LBRY claims are lowercase hex values

A "claim" is the part that comes after a `:` in a LBRY uri, and thus in our routing.

#### Give user access to more detais for "unknown" errors in API

Tell the user that an unknon error happened, at least. But maybe even give "details" under a dropdown? It could help in error reporting, not to mention development.

#### Video Service: Fix API argument in getVideo

In video.service getVideo, params.urls seems like it should be a list

#### CSS: before font loads, DASHsee logo breaks the header

## Reference

* https://spec.lbry.com/#url-resolution-examples
* https://lbry.tech/api/sdk#claim_search
* https://blog.angular-university.io/angular-jwt-authentication/ (not necessarily what we're following exactly, but it helps explain auth and Angular)


