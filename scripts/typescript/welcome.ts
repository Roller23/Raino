import { fadeIn, fadeOut, get } from "./utils";

export async function showWelcomeScreen() {
  return await fadeIn(get('.welcome-container')!, 400)
}

export async function hideWelcomeScreen() {
  return await fadeOut(get('.welcome-container')!, 400) 
}

get('#welcome-discover')!.addEventListener('click', function(this: HTMLElement, e: Event) {
  // TODO
  hideWelcomeScreen();
});

get('#welcome-create')!.addEventListener('click', function(this: HTMLElement, e: Event) {
  // TODO
  hideWelcomeScreen();
});

get('#welcome-invite')!.addEventListener('click', function(this: HTMLElement, e: Event) {
  // TODO
  hideWelcomeScreen();
});

get('#welcome-add-friends')!.addEventListener('click', function(this: HTMLElement, e: Event) {
  // TODO
  hideWelcomeScreen();
});

get('#welcome-get-help')!.addEventListener('click', function(this: HTMLElement, e: Event) {
  // TODO
  hideWelcomeScreen();
});