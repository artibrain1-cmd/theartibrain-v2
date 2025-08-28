import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const editorPassword = await bcrypt.hash('editor123', 10)
  const authorPassword = await bcrypt.hash('author123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@theartibrain.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@theartibrain.com',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'Platform administrator with full access to all features and content management.',
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@theartibrain.com' },
    update: {},
    create: {
      name: 'Editor User',
      email: 'editor@theartibrain.com',
      password: editorPassword,
      role: 'EDITOR',
      bio: 'Content editor specializing in AI and machine learning topics.',
    },
  })

  const author = await prisma.user.upsert({
    where: { email: 'author@theartibrain.com' },
    update: {},
    create: {
      name: 'Author User',
      email: 'author@theartibrain.com',
      password: authorPassword,
      role: 'AUTHOR',
      bio: 'AI researcher and technical writer passionate about sharing knowledge.',
    },
  })

  console.log('👥 Created users:', { admin: admin.email, editor: editor.email, author: author.email })

  // Create categories
  const aiCategory = await prisma.category.upsert({
    where: { slug: 'artificial-intelligence' },
    update: {},
    create: {
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
    },
  })

  const mlCategory = await prisma.category.upsert({
    where: { slug: 'machine-learning' },
    update: {},
    create: {
      name: 'Machine Learning',
      slug: 'machine-learning',
    },
  })

  const tutorialsCategory = await prisma.category.upsert({
    where: { slug: 'tutorials' },
    update: {},
    create: {
      name: 'Tutorials',
      slug: 'tutorials',
    },
  })

  const newsCategory = await prisma.category.upsert({
    where: { slug: 'news' },
    update: {},
    create: {
      name: 'News',
      slug: 'news',
    },
  })

  console.log('📁 Created categories:', [aiCategory.name, mlCategory.name, tutorialsCategory.name, newsCategory.name])

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'deep-learning' },
      update: {},
      create: { name: 'Deep Learning', slug: 'deep-learning' },
    }),
    prisma.tag.upsert({
      where: { slug: 'neural-networks' },
      update: {},
      create: { name: 'Neural Networks', slug: 'neural-networks' },
    }),
    prisma.tag.upsert({
      where: { slug: 'python' },
      update: {},
      create: { name: 'Python', slug: 'python' },
    }),
    prisma.tag.upsert({
      where: { slug: 'tensorflow' },
      update: {},
      create: { name: 'TensorFlow', slug: 'tensorflow' },
    }),
    prisma.tag.upsert({
      where: { slug: 'pytorch' },
      update: {},
      create: { name: 'PyTorch', slug: 'pytorch' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nlp' },
      update: {},
      create: { name: 'NLP', slug: 'nlp' },
    }),
  ])

  console.log('🏷️ Created tags:', tags.map(tag => tag.name))

  // Create sample posts
  const posts = [
    {
      title: 'Getting Started with Machine Learning in 2024',
      slug: 'getting-started-machine-learning-2024',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Machine learning has become one of the most exciting and rapidly evolving fields in technology. Whether you\'re a complete beginner or looking to advance your skills, this comprehensive guide will help you navigate the machine learning landscape in 2024.'
              }
            ]
          }
        ]
      },
      excerpt: 'A comprehensive guide to starting your machine learning journey in 2024, covering essential concepts, tools, and practical steps.',
      status: 'PUBLISHED',
      authorId: author.id,
      categoryId: mlCategory.id,
      tagIds: [tags[0].id, tags[2].id], // Deep Learning, Python
    },
    {
      title: 'The Future of Artificial Intelligence: Trends and Predictions',
      slug: 'future-artificial-intelligence-trends-predictions',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'As we advance further into the digital age, artificial intelligence continues to reshape industries and redefine what\'s possible. From autonomous vehicles to personalized medicine, AI is at the forefront of innovation.'
              }
            ]
          }
        ]
      },
      excerpt: 'Explore the latest trends in AI technology and what experts predict for the future of artificial intelligence.',
      status: 'PUBLISHED',
      authorId: editor.id,
      categoryId: aiCategory.id,
      tagIds: [tags[1].id], // Neural Networks
    },
    {
      title: 'Building Your First Neural Network with TensorFlow',
      slug: 'building-first-neural-network-tensorflow',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'In this hands-on tutorial, we\'ll walk through the process of building your first neural network using TensorFlow. You\'ll learn the fundamental concepts and implement a working model step by step.'
              }
            ]
          }
        ]
      },
      excerpt: 'Step-by-step tutorial for creating your first neural network using TensorFlow, perfect for beginners.',
      status: 'PUBLISHED',
      authorId: author.id,
      categoryId: tutorialsCategory.id,
      tagIds: [tags[1].id, tags[3].id], // Neural Networks, TensorFlow
    },
    {
      title: 'Natural Language Processing: Understanding Human Language',
      slug: 'natural-language-processing-understanding-human-language',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Natural Language Processing (NLP) is a fascinating branch of AI that focuses on the interaction between computers and human language. Discover how machines can understand, interpret, and generate human language.'
              }
            ]
          }
        ]
      },
      excerpt: 'An introduction to Natural Language Processing and how AI systems understand and process human language.',
      status: 'PUBLISHED',
      authorId: editor.id,
      categoryId: aiCategory.id,
      tagIds: [tags[5].id, tags[2].id], // NLP, Python
    },
    {
      title: 'PyTorch vs TensorFlow: Choosing the Right Framework',
      slug: 'pytorch-vs-tensorflow-choosing-right-framework',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'When starting with deep learning, one of the first decisions you\'ll face is choosing between PyTorch and TensorFlow. Both are powerful frameworks, but they have different strengths and use cases.'
              }
            ]
          }
        ]
      },
      excerpt: 'A detailed comparison of PyTorch and TensorFlow to help you choose the best deep learning framework for your projects.',
      status: 'DRAFT',
      authorId: author.id,
      categoryId: tutorialsCategory.id,
      tagIds: [tags[3].id, tags[4].id], // TensorFlow, PyTorch
    },
  ]

  for (const postData of posts) {
    const { categoryId, tagIds, ...postFields } = postData
    
    const post = await prisma.post.create({
      data: {
        ...postFields,
        publishedAt: postData.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    // Create category relationship
    await prisma.postCategory.create({
      data: {
        postId: post.id,
        categoryId: categoryId,
      },
    })

    // Create tag relationships
    for (const tagId of tagIds) {
      await prisma.postTag.create({
        data: {
          postId: post.id,
          tagId: tagId,
        },
      })
    }

    console.log(`📝 Created post: ${post.title}`)
  }

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

