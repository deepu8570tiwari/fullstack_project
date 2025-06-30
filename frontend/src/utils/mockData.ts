// Order data with types
export const mockOrders = [
  {
    id: "1234",
    client: "Grand Plaza Hotel",
    clientType: "hotel",
    items: 45,
    status: "pending",
    date: "2025-03-15",
    address: "123 Main Street, Downtown, NY 10001",
    contactPerson: "John Smith",
    contactNumber: "212-555-1234"
  },
  {
    id: "1235",
    client: "City General Hospital",
    clientType: "hospital",
    items: 78,
    status: "picked_up",
    date: "2025-03-15",
    address: "456 Park Avenue, Midtown, NY 10022",
    contactPerson: "Sarah Johnson",
    contactNumber: "212-555-5678"
  },
  {
    id: "1236",
    client: "Luxe Salon & Spa",
    clientType: "salon",
    items: 22,
    status: "in_process",
    date: "2025-03-14",
    address: "789 Broadway, SoHo, NY 10012",
    contactPerson: "Michael Chen",
    contactNumber: "212-555-9012"
  },
  {
    id: "1237",
    client: "Riverside Medical Center",
    clientType: "hospital",
    items: 63,
    status: "completed",
    date: "2025-03-14",
    address: "321 River Road, Westside, NY 10023",
    contactPerson: "Emily Rodriguez",
    contactNumber: "212-555-3456"
  },
  {
    id: "1238",
    client: "Boutique Inn",
    clientType: "hotel",
    items: 31,
    status: "pending",
    date: "2025-03-13",
    address: "555 Fifth Avenue, Uptown, NY 10024",
    contactPerson: "David Wilson",
    contactNumber: "212-555-7890"
  },
  {
    id: "1239",
    client: "Modern Styles",
    clientType: "salon",
    items: 15,
    status: "completed",
    date: "2025-03-13",
    address: "888 Fashion Street, Garment District, NY 10018",
    contactPerson: "Lisa Kim",
    contactNumber: "212-555-2345"
  },
  {
    id: "1240",
    client: "Bayside Hospital",
    clientType: "hospital",
    items: 92,
    status: "in_process",
    date: "2025-03-12",
    address: "444 Bayside Drive, Eastside, NY 10028",
    contactPerson: "Robert Taylor",
    contactNumber: "212-555-6789"
  },
  {
    id: "1241",
    client: "Sunset Resort",
    clientType: "hotel",
    items: 53,
    status: "picked_up",
    date: "2025-03-12",
    address: "777 Sunset Boulevard, Westside, NY 10023",
    contactPerson: "Amanda Brown",
    contactNumber: "212-555-0123"
  }
];

// Client data
export const mockClients = [
  {
    id: "C001",
    name: "Grand Plaza Hotel",
    type: "hotel",
    address: "123 Main Street, Downtown, NY 10001",
    contactPerson: "John Smith",
    contactEmail: "jsmith@grandplaza.com",
    contactPhone: "212-555-1234",
    totalOrders: 87
  },
  {
    id: "C002",
    name: "City General Hospital",
    type: "hospital",
    address: "456 Park Avenue, Midtown, NY 10022",
    contactPerson: "Sarah Johnson",
    contactEmail: "sjohnson@citygeneral.org",
    contactPhone: "212-555-5678",
    totalOrders: 154
  },
  {
    id: "C003",
    name: "Luxe Salon & Spa",
    type: "salon",
    address: "789 Broadway, SoHo, NY 10012",
    contactPerson: "Michael Chen",
    contactEmail: "mchen@luxesalon.com",
    contactPhone: "212-555-9012",
    totalOrders: 42
  },
  {
    id: "C004",
    name: "Riverside Medical Center",
    type: "hospital",
    address: "321 River Road, Westside, NY 10023",
    contactPerson: "Emily Rodriguez",
    contactEmail: "erodriguez@riversidemed.org",
    contactPhone: "212-555-3456",
    totalOrders: 132
  },
  {
    id: "C005",
    name: "Boutique Inn",
    type: "hotel",
    address: "555 Fifth Avenue, Uptown, NY 10024",
    contactPerson: "David Wilson",
    contactEmail: "dwilson@boutiqueinn.com",
    contactPhone: "212-555-7890",
    totalOrders: 65
  },
  {
    id: "C006",
    name: "Modern Styles",
    type: "salon",
    address: "888 Fashion Street, Garment District, NY 10018",
    contactPerson: "Lisa Kim",
    contactEmail: "lkim@modernstyles.com",
    contactPhone: "212-555-2345",
    totalOrders: 37
  },
  {
    id: "C007",
    name: "Bayside Hospital",
    type: "hospital",
    address: "444 Bayside Drive, Eastside, NY 10028",
    contactPerson: "Robert Taylor",
    contactEmail: "rtaylor@baysidehospital.org",
    contactPhone: "212-555-6789",
    totalOrders: 118
  },
  {
    id: "C008",
    name: "Sunset Resort",
    type: "hotel",
    address: "777 Sunset Boulevard, Westside, NY 10023",
    contactPerson: "Amanda Brown",
    contactEmail: "abrown@sunsetresort.com",
    contactPhone: "212-555-0123",
    totalOrders: 73
  }
];