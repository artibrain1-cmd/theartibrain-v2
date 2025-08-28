import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import slugify from "slugify"

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { name } = body

    if (!name) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const slug = slugify(name, { lower: true, strict: true })

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    })
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error("Error creating tag:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


