import { fadeIn, get } from "./utils";

export async function showWelcomeScreen() {
  return await fadeIn(get('.welcome-container')!, 400)
}