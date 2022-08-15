/*
	Two ngrock instances for bot backend and Web App
	For local use only
*/

const ngrockUrl: string = "https://e9ed-196-196-53-85.eu.ngrok.io";

export const hostURL: string =
  process.env.NODE_ENV !== "production"
    ? `${ngrockUrl}`
    : `https://${process.env.VIRTUAL_HOST}`;
