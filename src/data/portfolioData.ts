type Achievement = {
  title: string
  description: string
  date: string
  highlight?: boolean
  pdfPath?: string
}

export const portfolioData = {
  personal: {
    name: 'Narender Kumar',
    title: 'Full Stack Developer',
    subtitle: 'React.js • Flutter • Python • Docker | AI-Assisted Development | B.Tech - AI & DS',
    email: 'narenderkumar.hut@gmail.com',
    phone: '+91 9462835610',
    // TODO(nkverma): replace with your own location
    location: 'Dabli Rathan, Hanumangarh, Rajasthan – 335801',
    linkedin: 'https://www.linkedin.com/in/narendra-kumar-verma-41a15a191/',
    github: 'https://github.com/nkverma07',
    resume: '/resume/narender-kumar-resume.pdf',
    resumeFileName: 'Narender-Kumar-Resume.pdf',
  },

  about: {
    summary:
      'Passionate Full Stack Developer with expertise in building modern web and mobile applications using React.js, Flutter, Python, and Docker. Proficient in end-to-end development from responsive frontend design (HTML/CSS) to scalable backend solutions. Experienced in leveraging AI tools for rapid prototyping while maintaining strong planning, debugging, and problem-solving skills. Skilled in FlutterFlow and Figma for efficient UI/UX design, with solid knowledge of version control (Git/GitHub) and containerization. Committed to delivering high-performance, production-ready applications through innovative thinking and collaborative teamwork.',
    highlights: [
      '8.0 CGPA in AI & Data Science',
      // 'Runner-up in Hack Arya Verse (2nd/120 teams)',
      // 'Full Stack Developer at mPass',
      '6+ Certifications from leading organizations',
    ],
  },

  education: [
    {
      degree: 'B.Tech in Artificial Intelligence & Data Science',
      institution: 'Arya College of Engineering & I.T., Jaipur',
      duration: '2022 – 2026',
      score: 'CGPA: 8.00',
    },
    {
      degree: 'Senior Secondary',
      institution: 'RBSE',
      duration: '2019',
      score: '72.50%',
    },
    {
      degree: 'Secondary',
      institution: 'RBSE',
      duration: '2017',
      score: '82.50%',
    },
  ],

  skills: {
    technical: [
      { name: 'React.js', level: 90, category: 'Frontend' },
      { name: 'Flutter', level: 90, category: 'Mobile' },
      { name: 'Python', level: 85, category: 'Language' },
      { name: 'HTML & CSS', level: 95, category: 'Frontend' },
      { name: 'JavaScript', level: 90, category: 'Language' },
      { name: 'Docker', level: 80, category: 'DevOps' },
      { name: 'Git & GitHub', level: 90, category: 'Tools' },
      { name: 'FlutterFlow', level: 85, category: 'Tools' },
      { name: 'Figma', level: 80, category: 'Design' },
      { name: 'Firebase', level: 85, category: 'Backend' },
      { name: 'FastAPI', level: 80, category: 'Backend' },
      { name: 'RESTful APIs', level: 85, category: 'Backend' },
      { name: 'MySQL', level: 75, category: 'Database' },
      { name: 'AI-Assisted Development', level: 85, category: 'Tools' },
      { name: 'Dart', level: 90, category: 'Language' },
      { name: 'DSA', level: 75, category: 'Core' },
    ],
    soft: [
      'Strategic Planning & Architecture',
      'Advanced Debugging & Problem Solving',
      'Team Collaboration & Leadership',
      'Creative Ideation & Innovation',
      'Code Review & Optimization',
      'Project Management',
      'Technical Documentation',
    ],
  },

  // TODO(nkverma): descriptions/features/technologies below are conservative
  // placeholders derived only from the store listings / URL. Refine them to
  // accurately describe your work before publishing.
  projects: [
    {
      title: 'QBit Solution',
      description:
        'Web platform / product built and maintained under the QBit Solution brand.',
      technologies: ['Web'],
      features: [],
      link: 'https://qbitsolution.com',
    },
    {
      title: 'QR Scanner',
      description:
        'Android QR code and barcode scanner app, published on the Google Play Store.',
      technologies: ['Android'],
      features: [],
      image: '/logos/qr-scanner.png',
      link: 'https://play.google.com/store/apps/details?id=com.narender.qrscanner&hl=en_IN',
    },
    {
      title: 'All-in-One Video Downloader',
      description:
        'Android video downloader and saver app, published on the Google Play Store.',
      technologies: ['Android'],
      features: [],
      image: '/logos/video-downloader.jpg',
      link: 'https://play.google.com/store/apps/details?id=com.goalfinstech.downloader.videodownloader.videosaver.allinvideodownloader&hl=en_IN',
    },
  ],

  experience: [
    {
      role: 'Software Engineer',
      company: 'mPass Lobby Management Pvt. Ltd',
      location: 'Jaipur, Rajasthan',
      type: 'On-site',
      duration: 'April 2025 – Present',
      description:
        'Building scalable, high-performance backend systems with Python and FastAPI — from microservices architecture and database design to containerized cloud deployments.',
      responsibilities: [
        'Developed scalable backend systems using Python and FastAPI, building high-performance RESTful APIs',
        'Designed and implemented microservices architecture to improve scalability and modularity',
        'Built and optimized database systems using PostgreSQL, MySQL, and SQLite with efficient schema design',
        'Implemented secure authentication using JWT tokens and cookies',
        'Integrated Redis caching to reduce API response time and improve performance',
        'Containerized applications using Docker and deployed on AWS cloud infrastructure',
        'Configured Nginx for load balancing and reverse proxy handling',
        'Designed complete system architecture including API workflows and service communication',
        'Integrated backend services with frontend applications and Firebase',
        'Improved API performance through optimization and debugging',
        'Collaborated using GitHub for version control and agile workflows',
      ],
      technologies: [
        'Python',
        'FastAPI',
        'PostgreSQL',
        'MySQL',
        'SQLite',
        'Redis',
        'Docker',
        'AWS',
        'Nginx',
        'JWT',
        'Firebase',
        'GitHub',
      ],
    },
  ],

  certifications: [
    {
      title: 'CLA: Programming Essentials in C',
      issuer: 'Cisco Networking Academy (C++ Institute)',
      date: 'December 2023',
      category: 'Programming',
      pdfPath: '/certificates/c-programming-cisco.pdf',
      credentialId: 'CLA Certification Ready',
    },
    {
      title: 'Cpp (C++) Training',
      issuer: 'Spoken Tutorial Project, IIT Bombay',
      date: 'November 2023',
      category: 'Programming',
      pdfPath: '/certificates/cpp-spoken-tutorial-iitb.pdf',
      credentialId: '3565265K5V',
    },
    {
      title: 'Python Programming for Beginners (Full Course)',
      issuer: 'Udemy',
      date: 'February 2024',
      category: 'Programming',
      pdfPath: '/certificates/python.pdf',
      credentialId: 'UC-30eed0c4-871d-469c-b6f5-7501c6519315',
    },
    {
      title: 'Flutter in 7 Days',
      issuer: 'Udemy (Packt Publishing)',
      date: 'October 2024',
      category: 'Mobile',
      pdfPath: '/certificates/flutter.pdf',
      credentialId: 'UC-f0285430-42d8-4950-87a9-4d656764de13',
    },
    {
      title: 'Mastering Data Analytics – Python, SQL, Excel, Tableau',
      issuer: 'GeeksforGeeks',
      date: '2024',
      category: 'Data Science',
      pdfPath: '/certificates/gfg-data-analytics.pdf',
    },
    {
      title: 'Fundamentals of Salesforce & Internship',
      issuer: 'TechForce Academy',
      date: 'August 2024',
      category: 'Platform',
      pdfPath: '/certificates/salesforce.pdf',
      credentialId: '20973421-20252671',
    },
  ],

  achievements: [
    // {
    //   title: 'Runner-up - Hack Arya Verse Hackathon',
    //   description: 'Ranked 2nd out of 120 teams',
    //   date: '2025',
    //   highlight: true,
    // },
    // {
    //   title: 'ACE Hack 4.0 Participant',
    //   description: 'Participated in competitive hackathon organized at UEM Jaipur',
    //   date: 'March 29-30, 2025',
    //   pdfPath: '/certificates/acehack4.pdf',
    // },
  ] as Achievement[],

  gallery: [
    // '/gallery/WhatsApp Image 2025-10-10 at 11.24.02_92ce15a2.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.24.03_24ff7565.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.24.03_493264a0.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.24.03_9c8db22d.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.24.04_f4e67fca.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.25.56_9d3aab2a.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.27.58_740e8c80.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.27.58_b5b7bd9e.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.27.59_3b99eecf.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.27.59_477ca8d8.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.27.59_ad4f405c.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.27.59_b9daa40c.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.28.00_54108546.jpg',
    // '/gallery/WhatsApp Image 2025-10-10 at 11.28.00_dd897863.jpg',
  ],

  languages: ['English', 'Hindi'],
}
