/*
	Two ngrock instances for bot backend and Web App
	For local use only
*/

const ngrockUrl: string = "https://7888-46-246-41-166.eu.ngrok.io";

export const hostURL: string =
  process.env.NODE_ENV !== "production"
    ? `${ngrockUrl}`
    : `https://${process.env.VIRTUAL_HOST}`;
