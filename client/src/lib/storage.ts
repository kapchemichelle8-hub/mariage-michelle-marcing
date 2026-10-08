/** Petit souvenir local du dernier billet, sans jamais bloquer si le stockage est indisponible. */
const KEY = "mm-dernier-billet";

export function rememberTicket(code: string) {
  try {
    localStorage.setItem(KEY, code);
  } catch {
    /* stockage indisponible : sans conséquence */
  }
}

export function lastTicket() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
