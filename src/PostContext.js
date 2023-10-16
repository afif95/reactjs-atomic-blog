import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// Context API: create a context
// PostContext is a component
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  // PostProvider is the child element of App component, when App component rerenders PostProvider rerenders as well and OBJECT of values will be recreated ultimately changing the context values.
  // advanced optimization: one context per state
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, searchedPosts]);

  return (
    // Context API: provide value to child components
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

// custom hook
function usePosts() {
  const context = useContext(PostContext);
  // this prevents bugs in large scale applications
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider.");
  return context;
}

export { PostProvider, usePosts };
