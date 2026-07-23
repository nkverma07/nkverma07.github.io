/**
 * Generate Schema.org JSON-LD structured data for SEO
 * This helps search engines understand your portfolio content
 */

export const getPersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://nkverma.me",
  "name": "Narender Kumar",
  "jobTitle": "Flutter Developer & Full Stack Engineer",
  "description": "Motivated Flutter developer with expertise in mobile app development, AI/ML fundamentals, and backend integration",
  "url": "https://nkverma.me",
  "email": "narenderkumar.hut@gmail.com",
  "telephone": "+91-9462835610",
  "image": "https://nkverma.me/profile.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/narendra-kumar-verma-41a15a191/",
    "https://github.com/nkverma07",
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Deoria, Muzaffarpur",
    "addressLocality": "Bihar",
    "postalCode": "843120",
    "addressCountry": "IN",
  },
  "affiliation": {
    "@type": "Organization",
    "name": "Arya College of Engineering & I.T.",
    "url": "https://www.aryacollege.ac.in",
  },
  "knowsAbout": [
    "Flutter Development",
    "Mobile App Development",
    "Full Stack Development",
    "React",
    "Firebase",
    "Python",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Web Development",
    "TypeScript",
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "College Education",
      "name": "B.Tech in Artificial Intelligence & Data Science",
      "issuedBy": {
        "@type": "Organization",
        "name": "Arya College of Engineering & I.T., Jaipur",
      },
    },
  ],
});

export const getPortfolioSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Narender Kumar - Interactive 3D Portfolio",
  "description": "Interactive 3D portfolio with immersive city exploration featuring projects, certifications, and achievements",
  "url": "https://nkverma.me",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "author": {
    "@type": "Person",
    "name": "Narender Kumar",
  },
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
});

export const getProjectSchema = (project: {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  features?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": project.title,
  "description": project.description,
  "url": project.link || "https://nkverma.me/#projects",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "operatingSystem": "Web, Android, iOS",
  "author": {
    "@type": "Person",
    "name": "Narender Kumar",
  },
  "keywords": project.technologies.join(","),
});

export const getEducationSchema = (education: {
  degree: string;
  institution: string;
  duration: string;
  score: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  "name": education.degree,
  "educationalLevel": "Higher Education",
  "issuedBy": {
    "@type": "Organization",
    "name": education.institution,
  },
  "validFrom": education.duration,
});

/**
 * Insert structured data into HTML head
 * Usage: Add <script type="application/ld+json">{JSON.stringify(schema)}</script>
 */
export const insertStructuredData = (schema: any) => {
  if (typeof document === "undefined") return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Initialize all structured data on page load
 */
export const initializeStructuredData = () => {
  insertStructuredData(getPersonSchema());
  insertStructuredData(getPortfolioSchema());
};
