import { type NextRequest, NextResponse } from "next/server"
import { getFeatureRequests, createFeatureRequest } from "@/lib/store"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId") || "default"

  try {
    // Get all feature requests for the product
    const featureRequests = getFeatureRequests(productId)
    return NextResponse.json(featureRequests)
  } catch (error) {
    console.error("Error fetching feature requests:", error)
    return NextResponse.json({ error: "Failed to fetch feature requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, productId = "default" } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Create the feature request
    const featureRequest = createFeatureRequest(title, description || "", productId)

    return NextResponse.json(featureRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating feature request:", error)
    return NextResponse.json({ error: "Failed to create feature request" }, { status: 500 })
  }
}

