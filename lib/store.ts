// In-memory data store for feature requests

export type FeatureRequestStatus = "Submitted" | "Accepted" | "Rejected" | "Delivered"

export interface FeatureRequest {
  id: string
  title: string
  description: string
  productId: string
  votes: number
  createdAt: string
  status: FeatureRequestStatus
}

// Generate a simple UUID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Sample data with different statuses
const sampleFeatureRequests: FeatureRequest[] = [
  {
    id: generateId(),
    title: "Dark mode support",
    description: "Add dark mode to reduce eye strain when using the app at night.",
    productId: "default",
    votes: 24,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    status: "Delivered",
  },
  {
    id: generateId(),
    title: "Export data to CSV",
    description: "Allow users to export their data to CSV format for analysis in other tools.",
    productId: "default",
    votes: 18,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: "Accepted",
  },
  {
    id: generateId(),
    title: "Integration with Slack",
    description: "Add the ability to receive notifications in Slack when important events happen.",
    productId: "default",
    votes: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "Submitted",
  },
  {
    id: generateId(),
    title: "Voice commands",
    description: "Add voice command support for hands-free operation.",
    productId: "default",
    votes: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: "Rejected",
  },
]

// In-memory storage
const featureRequests: FeatureRequest[] = [...sampleFeatureRequests]

// Get all feature requests for a product
export const getFeatureRequests = (productId: string): FeatureRequest[] => {
  return featureRequests.filter((request) => request.productId === productId)
}

// Create a new feature request
export const createFeatureRequest = (title: string, description: string, productId: string): FeatureRequest => {
  const newRequest: FeatureRequest = {
    id: generateId(),
    title,
    description,
    productId,
    votes: 0,
    createdAt: new Date().toISOString(),
    status: "Submitted", // Default status
  }

  featureRequests.push(newRequest)
  return newRequest
}

// Vote on a feature request
export const voteOnFeatureRequest = (id: string, direction: "up" | "down"): FeatureRequest | null => {
  const request = featureRequests.find((req) => req.id === id)

  if (!request) {
    return null
  }

  request.votes += direction === "up" ? 1 : -1
  return request
}

// Get a single feature request by ID
export const getFeatureRequestById = (id: string): FeatureRequest | null => {
  return featureRequests.find((req) => req.id === id) || null
}

// Update the status of a feature request
export const updateFeatureRequestStatus = (id: string, status: FeatureRequestStatus): FeatureRequest | null => {
  const request = featureRequests.find((req) => req.id === id)

  if (!request) {
    return null
  }

  request.status = status
  return request
}

