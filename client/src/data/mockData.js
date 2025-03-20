// Mock Users
export const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    role: "customer",
    photoUrl: "https://i.pravatar.cc/150?img=1",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "123-456-7891",
    role: "worker",
    photoUrl: "https://i.pravatar.cc/150?img=2",
    createdAt: new Date("2023-01-02"),
  },
  {
    id: "user3",
    name: "Admin User",
    email: "admin@example.com",
    phone: "123-456-7892",
    role: "admin",
    photoUrl: "https://i.pravatar.cc/150?img=3",
    createdAt: new Date("2023-01-03"),
  },
];

// Mock Workers
export const mockWorkers = [
  {
    id: "worker1",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "123-456-7891",
    role: "worker",
    photoUrl: "https://i.pravatar.cc/150?img=2",
    createdAt: new Date("2023-01-02"),
    services: ["Plumbing", "Electrical"],
    specializations: ["Pipe Fixing", "Leak Repair"],
    rating: 4.5,
    verified: true,
    documents: {
      aadhaarCard: "aadhaar_12345.jpg",
      photo: "photo_jane.jpg",
      workImages: ["work1.jpg", "work2.jpg"]
    },
    available: true,
    location: "Mumbai",
    pricing: {
      "Plumbing": 500,
      "Electrical": 600
    },
    description: "Experienced plumber with 5+ years of experience in residential and commercial plumbing.",
    status: "approved"
  },
  {
    id: "worker2",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "123-456-7893",
    role: "worker",
    photoUrl: "https://i.pravatar.cc/150?img=4",
    createdAt: new Date("2023-01-04"),
    services: ["Cleaning", "Housekeeping"],
    specializations: ["Deep Cleaning", "Sanitization"],
    rating: 4.8,
    verified: true,
    documents: {
      aadhaarCard: "aadhaar_67890.jpg",
      photo: "photo_mike.jpg",
      workImages: ["work3.jpg", "work4.jpg"]
    },
    available: true,
    location: "Delhi",
    pricing: {
      "Cleaning": 400,
      "Housekeeping": 450
    },
    description: "Professional cleaner specializing in home and office cleaning services.",
    status: "approved"
  },
  {
    id: "worker3",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "123-456-7894",
    role: "worker",
    photoUrl: "https://i.pravatar.cc/150?img=5",
    createdAt: new Date("2023-01-05"),
    services: ["Electrical", "Air Conditioning"],
    specializations: ["Wiring", "AC Installation"],
    rating: 4.7,
    verified: true,
    documents: {
      aadhaarCard: "aadhaar_24680.jpg",
      photo: "photo_sarah.jpg",
      workImages: ["work5.jpg", "work6.jpg"]
    },
    available: true,
    location: "Bangalore",
    pricing: {
      "Electrical": 550,
      "Air Conditioning": 800
    },
    description: "Certified electrician with expertise in residential electrical work and AC installations.",
    status: "approved"
  },
  {
    id: "worker4",
    name: "David Brown",
    email: "david@example.com",
    phone: "123-456-7895",
    role: "worker",
    photoUrl: "https://i.pravatar.cc/150?img=6",
    createdAt: new Date("2023-01-06"),
    services: ["Carpentry", "Furniture Assembly"],
    specializations: ["Custom Furniture", "Repairs"],
    rating: 4.6,
    verified: true,
    documents: {
      aadhaarCard: "aadhaar_13579.jpg",
      photo: "photo_david.jpg",
      workImages: ["work7.jpg", "work8.jpg"]
    },
    available: false,
    location: "Pune",
    pricing: {
      "Carpentry": 600,
      "Furniture Assembly": 500
    },
    description: "Skilled carpenter with experience in custom furniture making and assembly.",
    status: "approved"
  },
  {
    id: "worker5",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "123-456-7896",
    role: "worker",
    photoUrl: "https://i.pravatar.cc/150?img=7",
    createdAt: new Date("2023-01-07"),
    services: ["Painting", "Interior Design"],
    specializations: ["Wall Painting", "Color Consultation"],
    rating: 4.9,
    verified: false,
    documents: {
      aadhaarCard: "aadhaar_97531.jpg",
      photo: "photo_emily.jpg",
      workImages: ["work9.jpg", "work10.jpg"]
    },
    available: true,
    location: "Hyderabad",
    pricing: {
      "Painting": 450,
      "Interior Design": 900
    },
    description: "Professional painter with an eye for design and color coordination.",
    status: "pending"
  }
];

// Mock Services
export const mockServices = [
  {
    id: "service1",
    name: "Plumbing",
    description: "Professional plumbing services for all your needs",
    imageUrl: "/placeholder.svg",
    category: "Home Repair",
    price: 500
  },
  {
    id: "service2",
    name: "Electrical",
    description: "Expert electrical services for residential and commercial properties",
    imageUrl: "/placeholder.svg",
    category: "Home Repair",
    price: 600
  },
  {
    id: "service3",
    name: "Cleaning",
    description: "Comprehensive cleaning services for homes and offices",
    imageUrl: "/placeholder.svg",
    category: "Home Maintenance",
    price: 400
  },
  {
    id: "service4",
    name: "Carpentry",
    description: "Skilled carpentry services for all your woodworking needs",
    imageUrl: "/placeholder.svg",
    category: "Home Improvement",
    price: 600
  },
  {
    id: "service5",
    name: "Painting",
    description: "Professional painting services for interior and exterior surfaces",
    imageUrl: "/placeholder.svg",
    category: "Home Improvement",
    price: 450
  },
  {
    id: "service6",
    name: "Air Conditioning",
    description: "AC installation, repair, and maintenance services",
    imageUrl: "/placeholder.svg",
    category: "Home Repair",
    price: 800
  },
  {
    id: "service7",
    name: "Housekeeping",
    description: "Regular housekeeping services for residential properties",
    imageUrl: "/placeholder.svg",
    category: "Home Maintenance",
    price: 450
  },
  {
    id: "service8",
    name: "Furniture Assembly",
    description: "Expert furniture assembly services for your convenience",
    imageUrl: "/placeholder.svg",
    category: "Home Improvement",
    price: 500
  }
];

// Mock Bookings
export const mockBookings = [
  {
    id: "booking1",
    customerId: "user1",
    workerId: "worker1",
    serviceId: "service1",
    status: "completed",
    date: new Date("2023-09-15"),
    time: "10:00 AM",
    location: "Mumbai",
    price: 500,
    paymentStatus: "completed",
    rating: 4,
    feedback: "Great service, very professional!"
  },
  {
    id: "booking2",
    customerId: "user1",
    workerId: "worker2",
    serviceId: "service3",
    status: "pending",
    date: new Date("2023-09-20"),
    time: "02:00 PM",
    location: "Mumbai",
    price: 400,
    paymentStatus: "pending"
  },
  {
    id: "booking3",
    customerId: "user1",
    workerId: "worker1",
    serviceId: "service2",
    status: "pending",
    date: new Date("2023-10-25"),
    time: "11:30 AM",
    location: "Mumbai Suburbs",
    price: 600,
    paymentStatus: "pending"
  },
  {
    id: "booking4",
    customerId: "user3",
    workerId: "worker1",
    serviceId: "service1",
    status: "accepted",
    date: new Date("2023-10-28"),
    time: "09:00 AM",
    location: "Andheri East",
    price: 500,
    paymentStatus: "pending"
  },
  {
    id: "booking5",
    customerId: "user1",
    workerId: "worker1",
    serviceId: "service2",
    status: "accepted",
    date: new Date("2023-11-02"),
    time: "04:00 PM",
    location: "Bandra West",
    price: 600,
    paymentStatus: "pending"
  }
];

// Service Categories
export const serviceCategories = [
  "Home Repair",
  "Home Maintenance",
  "Home Improvement",
  "Cleaning & Pest Control",
  "Beauty & Wellness",
  "Appliance Repair"
];
