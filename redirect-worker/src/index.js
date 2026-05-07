const TARGET = 'https://www.csstat.com';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const profileMatch = path.match(/^\/profiles\/(\d{17})(?:\/.*)?\/?$/i);
    if (profileMatch) {
      return Response.redirect(`${TARGET}/?q=${profileMatch[1]}&type=id`, 302);
    }

    const vanityMatch = path.match(/^\/id\/([^\/]+?)(?:\/.*)?\/?$/i);
    if (vanityMatch) {
      const vanity = decodeURIComponent(vanityMatch[1]);
      if (/^[a-zA-Z0-9_-]{1,64}$/.test(vanity)) {
        return Response.redirect(
          `${TARGET}/?q=${encodeURIComponent(vanity)}&type=vanity`,
          302
        );
      }
    }

    return Response.redirect(TARGET, 302);
  },
};
