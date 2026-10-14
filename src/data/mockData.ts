import { Complaint, CampusBuilding, User } from '../types';

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    name: 'Science & Engineering Hall',
    code: 'SEH',
    zone: 'North Academic Quad',
    commonAreas: ['Lab 304', 'Auditorium 101', 'Robotics Wing', '2nd Floor Restrooms', 'Study Lounge']
  },
  {
    name: 'Central University Library',
    code: 'CUL',
    zone: 'Central Quad',
    commonAreas: ['3rd Floor Quiet Zone', 'Ground Floor Cafe', 'Periodicals Wing', 'East Stacks', 'Group Study 204']
  },
  {
    name: 'North Dormitory Hall A',
    code: 'NDHA',
    zone: 'Residential North',
    commonAreas: ['Room 312', '4th Floor Laundry', 'West Wing Corridor', 'Common Room 1', 'Main Entry Foyer']
  },
  {
    name: 'Student Union Complex',
    code: 'SUC',
    zone: 'Student Life Hub',
    commonAreas: ['Dining Hall B', 'Bookstore Mezzanine', 'Campus Radio Room', 'Ballroom C', 'ATM Alcove']
  },
  {
    name: 'Health Sciences & Medical Center',
    code: 'HSMC',
    zone: 'South Campus',
    commonAreas: ['Clinical Skills Lab', 'Lecture Hall B', 'Ambulatory Entrance', 'Bioinformatics Suite']
  },
  {
    name: 'Athletics & Recreation Center',
    code: 'ARC',
    zone: 'West Campus',
    commonAreas: ['Indoor Pool Deck', 'Strength Training Gym', 'Locker Room A', 'Courts 1-3']
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'user-sarah-chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@campus.edu',
    role: 'student',
    studentId: 'STU-2024-8821',
    department: 'Computer Science & Engineering',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-08-20T10:00:00Z'
  },
  {
    id: 'user-marcus-vance',
    name: 'Marcus Vance',
    email: 'marcus.vance@campus.edu',
    role: 'admin',
    studentId: 'ADM-1002',
    department: 'Campus Operations & Facility Management',
    phone: '+1 (555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'user-david-miller',
    name: 'David Miller',
    email: 'david.m@campus.edu',
    role: 'staff',
    studentId: 'FAC-4091',
    department: 'Electrical & HVAC Maintenance Lead',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-05-10T08:30:00Z'
  },
  {
    id: 'user-alex-rivera',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    role: 'student',
    studentId: 'STU-2024-7612',
    department: 'Architecture & Design',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-09-01T11:15:00Z'
  },
  {
    id: 'user-maya-patel',
    name: 'Maya Patel',
    email: 'maya.patel@campus.edu',
    role: 'student',
    studentId: 'STU-2023-5519',
    department: 'Biological Sciences',
    phone: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-07-12T14:20:00Z'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CF-2026-101',
    title: 'Severe ceiling pipe leak above Robotics Workstation',
    description: 'A constant stream of water is dripping from the acoustic ceiling tiles directly above Workstation #4 in the Robotics Lab. Risk of electrical short-circuit with heavy lab equipment and power strips. Buckets placed as temporary catch.',
    category: 'Plumbing',
    priority: 'urgent',
    status: 'in_progress',
    building: 'Science & Engineering Hall',
    room: 'Lab 304',
    submittedBy: {
      id: 'user-sarah-chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@campus.edu',
      studentId: 'STU-2024-8821',
      department: 'Computer Science & Engineering',
      isAnonymous: false
    },
    assignedTo: {
      id: 'user-david-miller',
      name: 'David Miller',
      department: 'Plumbing & Emergency Services',
      phone: '+1 (555) 456-7890'
    },
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-10-12T08:30:00Z',
    updatedAt: '2026-10-13T10:15:00Z',
    upvotes: 18,
    upvotedBy: ['user-alex-rivera', 'user-maya-patel'],
    timeline: [
      {
        id: 'tl-101-1',
        title: 'Complaint Submitted',
        description: 'Reported with high urgency due to proximity to electrical lab benches.',
        timestamp: '2026-10-12T08:30:00Z',
        actor: 'Sarah Chen',
        actorRole: 'Student',
        status: 'submitted'
      },
      {
        id: 'tl-101-2',
        title: 'Triage & Verification',
        description: 'Facility operations verified leak on 3rd floor riser pipe.',
        timestamp: '2026-10-12T09:10:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'under_review'
      },
      {
        id: 'tl-101-3',
        title: 'Assigned to Plumbing Lead',
        description: 'Plumbing emergency crew dispatched with valve replacement parts.',
        timestamp: '2026-10-12T10:00:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'in_progress'
      }
    ],
    comments: [
      {
        id: 'cm-101-1',
        userId: 'user-david-miller',
        userName: 'David Miller',
        userRole: 'staff',
        text: 'Main isolation valve on branch 3B shut off to stop flow. Sourcing gasket replacement from central depot this morning.',
        timestamp: '2026-10-12T11:45:00Z',
        isInternal: false
      },
      {
        id: 'cm-101-2',
        userId: 'user-sarah-chen',
        userName: 'Sarah Chen',
        userRole: 'student',
        text: 'Thank you for the fast response! We moved the high-voltage microcontrollers to room 306 safely.',
        timestamp: '2026-10-12T12:05:00Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'CF-2026-102',
    title: 'Wi-Fi connectivity dropouts in 3rd Floor Quiet Study Wing',
    description: 'Eduroam and Campus-Guest signals continuously authenticate and then drop every 2-3 minutes. Affects students preparing for midterm exams across all carrels on the East wall.',
    category: 'Network & Wi-Fi',
    priority: 'high',
    status: 'under_review',
    building: 'Central University Library',
    room: '3rd Floor Quiet Zone',
    submittedBy: {
      id: 'user-alex-rivera',
      name: 'Alex Rivera',
      email: 'alex.rivera@campus.edu',
      studentId: 'STU-2024-7612',
      department: 'Architecture & Design',
      isAnonymous: false
    },
    images: [],
    createdAt: '2026-10-13T09:40:00Z',
    updatedAt: '2026-10-13T11:00:00Z',
    upvotes: 34,
    upvotedBy: ['user-sarah-chen', 'user-maya-patel'],
    timeline: [
      {
        id: 'tl-102-1',
        title: 'Report Received',
        description: 'Network anomaly logged by student with device traceroute test results.',
        timestamp: '2026-10-13T09:40:00Z',
        actor: 'Alex Rivera',
        actorRole: 'Student',
        status: 'submitted'
      },
      {
        id: 'tl-102-2',
        title: 'Under Review by Campus IT',
        description: 'IT Network Infrastructure reviewing AP-304 and AP-305 access point controller logs.',
        timestamp: '2026-10-13T11:00:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'under_review'
      }
    ],
    comments: [
      {
        id: 'cm-102-1',
        userId: 'user-marcus-vance',
        userName: 'Marcus Vance',
        userRole: 'admin',
        text: 'Internal IT ticket #NET-9021 created. Network team detected a faulty PoE injector on switch port 18. Replacement scheduled for 2:00 PM.',
        timestamp: '2026-10-13T11:30:00Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'CF-2026-103',
    title: 'Broken heating unit and window latch in Dorm Room 312',
    description: 'The radiator unit makes a loud clattering metallic noise every 15 minutes and blows no warm air. The left window latch is stuck ajar, causing cold drafts during nighttime.',
    category: 'Hostel & Housing',
    priority: 'high',
    status: 'in_progress',
    building: 'North Dormitory Hall A',
    room: 'Room 312',
    submittedBy: {
      id: 'user-sarah-chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@campus.edu',
      studentId: 'STU-2024-8821',
      department: 'Computer Science & Engineering',
      isAnonymous: false
    },
    assignedTo: {
      id: 'user-david-miller',
      name: 'David Miller',
      department: 'HVAC Specialists',
      phone: '+1 (555) 456-7890'
    },
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    createdAt: '2026-10-11T14:15:00Z',
    updatedAt: '2026-10-13T08:00:00Z',
    upvotes: 6,
    upvotedBy: [],
    timeline: [
      {
        id: 'tl-103-1',
        title: 'Complaint Logged',
        description: 'Reported dorm heating failure.',
        timestamp: '2026-10-11T14:15:00Z',
        actor: 'Sarah Chen',
        actorRole: 'Student',
        status: 'submitted'
      },
      {
        id: 'tl-103-2',
        title: 'Assigned to Residential Maintenance',
        description: 'Work order #DORM-881 dispatched to HVAC technician.',
        timestamp: '2026-10-12T08:30:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'in_progress'
      }
    ],
    comments: [
      {
        id: 'cm-103-1',
        userId: 'user-david-miller',
        userName: 'David Miller',
        userRole: 'staff',
        text: 'Inspected thermostat and actuator valve. Thermal actuator replaced; window lock re-aligned. Checking return temp tonight.',
        timestamp: '2026-10-13T08:15:00Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'CF-2026-104',
    title: 'Flickering fluorescent fixtures and missing emergency exit light',
    description: 'Two overhead ballasts in Auditorium 101 are rapidly strobe-flickering, creating headaches for lecture attendees. The green illuminated Exit sign above the east double doors is completely dark.',
    category: 'Electrical',
    priority: 'urgent',
    status: 'resolved',
    building: 'Science & Engineering Hall',
    room: 'Auditorium 101',
    submittedBy: {
      id: 'user-maya-patel',
      name: 'Maya Patel',
      email: 'maya.patel@campus.edu',
      studentId: 'STU-2023-5519',
      department: 'Biological Sciences',
      isAnonymous: false
    },
    assignedTo: {
      id: 'user-david-miller',
      name: 'David Miller',
      department: 'Electrical Team',
      phone: '+1 (555) 456-7890'
    },
    images: [],
    createdAt: '2026-10-09T16:20:00Z',
    updatedAt: '2026-10-11T15:30:00Z',
    resolvedAt: '2026-10-11T15:30:00Z',
    resolutionNotes: 'Replaced two electronic ballasts with modern energy-efficient 4000K LED panels. Battery backup pack installed for emergency EXIT signage and tested under simulated mains drop.',
    rating: 5,
    ratingFeedback: 'Fixed promptly before the Monday morning guest keynote! The new LED lighting is so much clearer.',
    upvotes: 21,
    upvotedBy: ['user-sarah-chen'],
    timeline: [
      {
        id: 'tl-104-1',
        title: 'Report Logged',
        description: 'Safety hazard noted regarding egress signage.',
        timestamp: '2026-10-09T16:20:00Z',
        actor: 'Maya Patel',
        actorRole: 'Student',
        status: 'submitted'
      },
      {
        id: 'tl-104-2',
        title: 'Work In Progress',
        description: 'Electrician on site with replacement LED conversion kits.',
        timestamp: '2026-10-10T11:00:00Z',
        actor: 'David Miller',
        actorRole: 'Staff',
        status: 'in_progress'
      },
      {
        id: 'tl-104-3',
        title: 'Resolved & Tested',
        description: 'All fixtures restored and emergency egress certificate signed.',
        timestamp: '2026-10-11T15:30:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'resolved'
      }
    ],
    comments: []
  },
  {
    id: 'CF-2026-105',
    title: 'Recycling station overflow and spill in Dining Hall B',
    description: 'Post-lunch rush caused both compost and plastic recycling receptacles to overflow onto the corridor floor. Liquid spill near the tray drop carousel is slippery.',
    category: 'Sanitation & Cleanliness',
    priority: 'medium',
    status: 'resolved',
    building: 'Student Union Complex',
    room: 'Dining Hall B',
    submittedBy: {
      id: 'user-sarah-chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@campus.edu',
      studentId: 'STU-2024-8821',
      department: 'Computer Science & Engineering',
      isAnonymous: false
    },
    images: [],
    createdAt: '2026-10-10T13:30:00Z',
    updatedAt: '2026-10-10T14:45:00Z',
    resolvedAt: '2026-10-10T14:45:00Z',
    resolutionNotes: 'Janitorial emergency team cleared overflow, mopped floors with slip hazard signage, and added two additional high-capacity collection bins for peak lunch hours.',
    rating: 5,
    ratingFeedback: 'Cleaned up within 45 minutes. Super efficient!',
    upvotes: 11,
    upvotedBy: [],
    timeline: [
      {
        id: 'tl-105-1',
        title: 'Submitted',
        description: 'Overflow reported via mobile.',
        timestamp: '2026-10-10T13:30:00Z',
        actor: 'Sarah Chen',
        actorRole: 'Student',
        status: 'submitted'
      },
      {
        id: 'tl-105-2',
        title: 'Cleaned & Resolved',
        description: 'Janitorial staff completed sanitation protocol.',
        timestamp: '2026-10-10T14:45:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'resolved'
      }
    ],
    comments: []
  },
  {
    id: 'CF-2026-106',
    title: 'Exterior pathway lamp dark near West Campus Recreation Trail',
    description: 'Lamp post #LP-42 on the wooded path connecting the Dormitories to the Recreation Center has been unlit for three consecutive nights. It creates an uncomfortable dark stretch for night-class students.',
    category: 'Security & Safety',
    priority: 'high',
    status: 'submitted',
    building: 'Athletics & Recreation Center',
    room: 'West Campus Trail',
    submittedBy: {
      id: 'user-maya-patel',
      name: 'Maya Patel',
      email: 'maya.patel@campus.edu',
      studentId: 'STU-2023-5519',
      department: 'Biological Sciences',
      isAnonymous: false
    },
    images: [],
    createdAt: '2026-10-13T18:10:00Z',
    updatedAt: '2026-10-13T18:10:00Z',
    upvotes: 42,
    upvotedBy: ['user-sarah-chen', 'user-alex-rivera'],
    timeline: [
      {
        id: 'tl-106-1',
        title: 'Complaint Submitted',
        description: 'Campus security and electrical safety notified.',
        timestamp: '2026-10-13T18:10:00Z',
        actor: 'Maya Patel',
        actorRole: 'Student',
        status: 'submitted'
      }
    ],
    comments: []
  },
  {
    id: 'CF-2026-107',
    title: 'Faulty ceiling projector HDMI connection and audio buzz',
    description: 'Main lecture projector in Room 204 produces continuous 60Hz hum when laptop connected via wall HDMI terminal. Screen intermittently turns magenta and flickers during faculty seminars.',
    category: 'Classroom & Labs',
    priority: 'medium',
    status: 'under_review',
    building: 'Science & Engineering Hall',
    room: 'Auditorium 101',
    submittedBy: {
      id: 'user-alex-rivera',
      name: 'Alex Rivera',
      email: 'alex.rivera@campus.edu',
      studentId: 'STU-2024-7612',
      department: 'Architecture & Design',
      isAnonymous: false
    },
    images: [],
    createdAt: '2026-10-12T15:20:00Z',
    updatedAt: '2026-10-13T09:00:00Z',
    upvotes: 9,
    upvotedBy: [],
    timeline: [
      {
        id: 'tl-107-1',
        title: 'Submitted',
        description: 'AV equipment glitch reported.',
        timestamp: '2026-10-12T15:20:00Z',
        actor: 'Alex Rivera',
        actorRole: 'Student',
        status: 'submitted'
      },
      {
        id: 'tl-107-2',
        title: 'Reviewing',
        description: 'Audiovisual tech checking ground-loop isolator.',
        timestamp: '2026-10-13T09:00:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'under_review'
      }
    ],
    comments: []
  },
  {
    id: 'CF-2026-108',
    title: 'Cracked concrete step and loose handrail at Main Library Entry',
    description: 'First riser of the south granite exterior staircase has broken concrete chunk exposing rebar edge. Handrail wobbles significantly when grasped, posing tripping hazard.',
    category: 'Infrastructure',
    priority: 'urgent',
    status: 'in_progress',
    building: 'Central University Library',
    room: 'South Entrance Portico',
    submittedBy: {
      id: 'user-david-miller',
      name: 'David Miller',
      email: 'david.m@campus.edu',
      studentId: 'FAC-4091',
      department: 'Facilities',
      isAnonymous: false
    },
    assignedTo: {
      id: 'user-david-miller',
      name: 'David Miller',
      department: 'Structural Repairs Team',
      phone: '+1 (555) 456-7890'
    },
    images: [],
    createdAt: '2026-10-11T09:00:00Z',
    updatedAt: '2026-10-13T07:30:00Z',
    upvotes: 28,
    upvotedBy: ['user-sarah-chen', 'user-alex-rivera', 'user-maya-patel'],
    timeline: [
      {
        id: 'tl-108-1',
        title: 'Hazards Flagged',
        description: 'Physical safety hazard flagged at main library entrance.',
        timestamp: '2026-10-11T09:00:00Z',
        actor: 'David Miller',
        actorRole: 'Staff',
        status: 'submitted'
      },
      {
        id: 'tl-108-2',
        title: 'Barrier Placed & Work Scheduled',
        description: 'High-visibility safety cone installed; structural masonry team curing polymer mortar patch.',
        timestamp: '2026-10-12T14:00:00Z',
        actor: 'Marcus Vance',
        actorRole: 'Administrator',
        status: 'in_progress'
      }
    ],
    comments: []
  }
];
