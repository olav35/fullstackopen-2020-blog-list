const dummy = (blogs) => 1

const totalLikes = (blogs) => 
  blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) =>  {
  let favoriteBlog = blogs[0]

  blogs.forEach(blog => {
    if(blog.likes > favoriteBlog.likes){
      favoriteBlog = blog
    }
  })
  
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  let bloggers = {}

  blogs.forEach(blog => {
    bloggers[blog.author] = bloggers[blog.author] + 1 || 1
  })

  // blogger with the most blogs
  let topBlogger = {
    blogs: 0
  }

  Object.entries(bloggers).forEach((blogger) => {
    const [author, blogs] = blogger
    if(blogs > topBlogger.blogs){
      topBlogger = {
        author,
        blogs,
      }
    }
  })

  return topBlogger
}

const mostLikes = (blogs) => {
  let bloggers = {}

  blogs.forEach(blog => {
    bloggers[blog.author] = bloggers[blog.author] + blog.likes || blog.likes
  })

  // blogger with the most likes
  let topBlogger = {
    likes: 0
  }

  Object.entries(bloggers).forEach((blogger) => {
    const [author, likes] = blogger
    if(likes > topBlogger.likes){
      topBlogger = {
        author,
        likes,
      }
    }
  })

  return topBlogger
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}