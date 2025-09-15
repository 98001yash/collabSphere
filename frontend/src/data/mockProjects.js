export const mockProjects = [
  {
    id: 1,
    title: "AI Resume Builder",
    description: "Build an AI-powered resume generator.",
    ownerName: "Alice",
    status: "PENDING",
    isContributor: false,
    pendingRequests: [
      { id: 101, studentName: "Bob" },
      { id: 102, studentName: "Charlie" }
    ],
    endorsements: ["React", "Node.js"]
  },
  {
    id: 2,
    title: "Web3 Ticket Booking DApp",
    description: "Decentralized app for booking event tickets.",
    ownerName: "David",
    status: "ONGOING",
    isContributor: true,
    pendingRequests: [],
    endorsements: ["Solidity", "Hardhat"]
  }
];
