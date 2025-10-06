/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://snippet.oreadigital.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
};
