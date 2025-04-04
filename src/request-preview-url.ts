import * as cheerio from "cheerio";

export async function getPreviewUrls(url: string) {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const $ = cheerio.load(html);
		const scdnLinks = new Set<string>();
		const metaTags = $("meta");

		metaTags.each((i, element) => {
			const attrs = element.attribs;
			// biome-ignore lint/complexity/noForEach: <explanation>
			Object.values(attrs).forEach((value) => {
				if (value?.includes("p.scdn.co")) {
					scdnLinks.add(value);
				}
			});
		});

		return Array.from(scdnLinks);
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching preview URLs:", error.message);
		}
		throw new Error("unknown error");
	}
}
