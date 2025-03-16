"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUp, ArrowDown, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface FeatureRequest {
  id: string
  title: string
  description: string
  productId: string
  votes: number
  createdAt: string
  status: "Submitted" | "Accepted" | "Rejected" | "Delivered"
}

export default function FeatureRequestPage() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId") || "default"
  const productName = searchParams.get("productName") || "Product"
  const { toast } = useToast()

  useEffect(() => {
    fetchFeatureRequests()
  }, [productId])

  const fetchFeatureRequests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/feature-requests?productId=${productId}`)
      const data = await response.json()
      setFeatureRequests(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feature requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titleRef.current?.value.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleRef.current?.value,
          description: descriptionRef.current?.value,
          productId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feature request submitted successfully",
        })

        titleRef.current!.value = ""
        descriptionRef.current!.value = ""

        // Add the new feature request to the list
        setFeatureRequests((prev) => [data, ...prev])
      } else {
        throw new Error(data.error || "Failed to submit feature request")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feature request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (id: string, direction: "up" | "down") => {
    // Optimistic update
    const updatedRequests = featureRequests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          votes: req.votes + (direction === "up" ? 1 : -1),
        }
      }
      return req
    })

    setFeatureRequests(updatedRequests)

    try {
      const response = await fetch(`/api/feature-requests/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, productId }),
      })

      if (!response.ok) {
        // Revert optimistic update if the request fails
        const data = await response.json()
        throw new Error(data.error || "Failed to vote")
      }
    } catch (error) {
      // Revert optimistic update
      setFeatureRequests(featureRequests)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to vote",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Accepted":
        return "secondary"
      case "Rejected":
        return "destructive"
      case "Delivered":
        return "success"
      default:
        return "default"
    }
  }

  const sortedFeatureRequests = [...featureRequests].sort((a, b) => b.votes - a.votes)

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Feature Requests for {productName}</h1>

      {/* Submission Form */}
      <Card className="mb-8 shadow-sm border border-border/40 overflow-hidden">
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Submit a new feature request
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                ref={titleRef}
                placeholder="Enter a concise title for your feature request"
                required
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                ref={descriptionRef}
                placeholder="Describe your feature request in detail"
                rows={3}
                className="focus-visible:ring-primary resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t bg-muted/30 py-3">
            <Button type="submit" disabled={isSubmitting} size="sm" className="px-4 transition-all">
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Separator className="my-8" />

      <h2 className="text-2xl font-bold mb-6">Current Requests</h2>

      {/* Feature Request List */}
      {isLoading ? (
        <div className="text-center py-12">Loading feature requests...</div>
      ) : sortedFeatureRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No feature requests yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedFeatureRequests.map((request) => (
            <Card
              key={request.id}
              className="overflow-hidden border border-border/40 hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div className="flex flex-col items-center justify-start p-4 bg-muted/50">
                  <Button variant="ghost" size="icon" onClick={() => handleVote(request.id, "up")} className="h-8 w-8">
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <span className="font-bold text-lg my-1">{request.votes}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleVote(request.id, "down")}
                    className="h-8 w-8"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle>{request.title}</CardTitle>
                      <Badge
                        variant={getStatusBadgeVariant(request.status)}
                        className="uppercase text-[10px] font-bold tracking-wider"
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{request.description}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

