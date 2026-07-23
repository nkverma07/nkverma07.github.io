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
      link: 'https://play.google.com/store/apps/details?id=com.narender.qrscanner&hl=en_IN',
    },
    {
      title: 'All-in-One Video Downloader',
      description:
        'Android video downloader and saver app, published on the Google Play Store.',
      technologies: ['Android'],
      features: [],
      link: 'https://play.google.com/store/apps/details?id=com.goalfinstech.downloader.videodownloader.videosaver.allinvideodownloader&hl=en_IN',
    },
  ],

  experience: [
    {
      role: 'Full Stack Developer Intern',
      company: 'mPass Lobby Management Pvt. Ltd.',
      location: 'Jaipur, Rajasthan',
      type: 'On-site',
      duration: 'June 2025 – July 2025 (45 Days)',
      description:
        'Worked on frontend development using Flutter, optimized UI performance, and implemented state management solutions.',
      responsibilities: [
        'Built and optimized frontend using Flutter',
        'Implemented state management with Provider',
        'Improved UI performance with widget tree debugging',
        'Contributed to live projects and internal development tasks',
      ],
      technologies: ['Flutter', 'Provider', 'Dart', 'Git'],
      stipend: '₹xx,000/month',
    },
  ],

  certifications: [
    // {
    //   title: 'Career Essentials in Generative AI',
    //   issuer: 'Microsoft & LinkedIn',
    //   date: 'July 2024',
    //   category: 'AI/ML',
    //   pdfPath: '/certificates/generative-ai-microsoft.pdf',
    // },
    {
      title: 'Programming Essentials in C',
      issuer: 'Cisco Networking Academy',
      date: 'December 2023',
      category: 'Programming',
      pdfPath: '/certificates/c-programming-cisco.pdf',
      credentialId: 'CLA Certification Ready',
    },
    // {
    //   title: 'Red Hat Certified System Administrator (RHCSA)',
    //   issuer: 'Red Hat Academy',
    //   date: 'April 2024',
    //   category: 'Systems',
    //   pdfPath: '/certificates/rhcsa-redhat.pdf',
    // },
    {
      title: 'Connecting to a MongoDB Database',
      issuer: 'MongoDB University',
      date: 'August 2024',
      category: 'Database',
      pdfPath: '/certificates/mongodb.pdf',
      credentialId: 'MDBnhg02c1f03',
    },
    // {
    //   title: 'DevTown Bootcamp',
    //   issuer: 'DevTown',
    //   date: '2024',
    //   category: 'Development',
    //   pdfPath: '/certificates/devtown-bootcamp.pdf',
    // },
    {
      title: 'Salesforce Fundamentals & Internship',
      issuer: 'Salesforce Trailhead',
      date: '2024',
      category: 'Platform',
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
