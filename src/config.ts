import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://mliu.me/",
  author: "Martin Liu",
  desc: "Martin Liu's blog.",
  title: "Martin Liu",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 6,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/martin-liu",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/hflhmartin/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:hflhmartin@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
