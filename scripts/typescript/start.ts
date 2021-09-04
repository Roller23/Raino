/**
 * Start script to be run on every app launch
 */

 import { setDefaultStorageValues } from "./storage";

if (localStorage.storageInitialized === undefined) {
  setDefaultStorageValues()
  localStorage.storageInitialized = 'true'
}