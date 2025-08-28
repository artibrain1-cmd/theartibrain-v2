import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { 
        slug: params.slug,
        status: "PUBLISHED"
      },
      include: {
        author: { 
          select: { 
            name: true, 
            avatarUrl: true, 
            bio: true 
          } 
        },
        categories: { 
          include: { 
            category: true 
          } 
        },
        tags: { 
          include: { 
            tag: true 
          } 
        },
      },
    })

    if (!post) {
      return new NextResponse("Post not found", { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

