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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}