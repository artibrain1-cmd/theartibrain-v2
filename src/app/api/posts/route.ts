import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import slugify from "slugify"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const authorId = searchParams.get("authorId")
  const categorySlug = searchParams.get("categorySlug")
  const tagSlug = searchParams.get("tagSlug")
  const status = searchParams.get("status")

  const where: any = {}

  if (authorId) {
    where.authorId = authorId
  }
  if (status) {
    where.status = status
  }
  if (categorySlug) {
    where.categories = {
      some: {
        category: { slug: categorySlug },
      },
    }
  }
  if (tagSlug) {
    where.tags = {
      some: {
        tag: { slug: tagSlug },
      },
    }
  }

  try {
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true, avatarUrl: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: "desc" },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, content, excerpt, featuredImage, status, categoryIds, tagIds } = body

    if (!title || !content) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const slug = slugify(title, { lower: true, strict: true })

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status,
        author: { connect: { id: session.user.id } },
        categories: {
          create: categoryIds.map((id: string) => ({ category: { connect: { id } } })),
        },
        tags: {
          create: tagIds.map((id: string) => ({ tag: { connect: { id } } })),
        },
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


