import { type NextRequest, NextResponse } from "next/server"
import { voteOnFeatureRequest, getFeatureRequestById } from "@/lib/store"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const { direction } = await request.json()

    if (!direction || !["up", "down"].includes(direction)) {
      return NextResponse.json({ error: "Invalid vote direction" }, { status: 400 })
    }

    // Check if the feature request exists
    const exists = getFeatureRequestById(id)

    if (!exists) {
      return NextResponse.json({ error: "Feature request not found" }, { status: 404 })
    }

    // Update the vote count
    const updatedRequest = voteOnFeatureRequest(id, direction as "up" | "down")

    if (!updatedRequest) {
      return NextResponse.json({ error: "Failed to update vote" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      votes: updatedRequest.votes,
    })
  } catch (error) {
    console.error("Error voting for feature request:", error)
    return NextResponse.json({ error: "Failed to vote for feature request" }, { status: 500 })
  }
}

