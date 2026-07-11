import { create } from "zustand";
import { devtools } from "zustand/middleware";
//import anecdoteService from './services/anecdotes'
import blogService from "./services/blogs";
import userService from "./services/users";

const useNotificationStore = create(
  devtools((set, get) => ({
    //create((set, get) => ({
    notification: { text: null, type: null },
    actions: {
      setNotificationMessage: (text, type = "info") =>
        set(() => ({
          notification: { text, type },
        })),
    },
  })),
);

const useUserStore = create(
  devtools((set, get) => ({
    //create((set, get) => ({
    user: null,
    allUsers: [],
    actions: {
      initUsers: async () => {
        const allUsers = await userService.getAll();
        set(() => ({ allUsers }));
      },
      setUser: (value) => set(() => ({ user: value })),
    },
  })),
);

const useBlogStore = create(
  devtools((set, get) => ({
    //create((set, get) => ({
    filter: null,
    blogs: [],
    actions: {
      initialize: async () => {
        const blogs = await blogService.getAll();
        set(() => ({ blogs }));
      },
      add: async (content) => {
        const newBlog = await blogService.create(content); // storeen
        set((state) => ({
          blogs: state.blogs
            .concat(newBlog)
            .toSorted((a, b) => b.likes - a.likes),
        }));
        useNotificationStore
          .getState()
          .actions.setNotificationMessage(
            `You added blog: "${newBlog.title} ${newBlog.author}"`,
            "success",
          );
        setTimeout(
          () =>
            useNotificationStore
              .getState()
              .actions.setNotificationMessage(null),
          5000,
        );
      },
      remove: async (id) => {
        const blog = get().blogs.find((n) => n.id === id);

        if (!blog || blog.likes > 0) return;

        await blogService.remove(blog);

        set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== id),
        }));

        useNotificationStore
          .getState()
          .actions.setNotificationMessage(
            `Deleted ${blog.title} with ${blog.likes} likes`,
            "success",
          );
        setTimeout(
          () =>
            useNotificationStore
              .getState()
              .actions.setNotificationMessage(null),
          5000,
        );
      },
      comment: async (id, text) => {
        console.log("inside store comment id", id);
        console.log("inside store comment text", text);

        const blog = get().blogs.find((n) => n.id === id);
        console.log("inside store found blog", blog);

        const updated = await blogService.addComment(id, text);

        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? updated : b)),
        }));

        useNotificationStore
          .getState()
          .actions.setNotificationMessage(
            `New comment to blog: "${updated.title} ${updated.author}"`,
            "success",
          );

        setTimeout(
          () =>
            useNotificationStore
              .getState()
              .actions.setNotificationMessage(null),
          5000,
        );
      },
      like: async (id) => {
        console.log("inside store like id", id);
        //const blog = useBlogStore.getState().blogs.find(n => n.id === id)
        const blog = get().blogs.find((n) => n.id === id);
        console.log("inside store found blog", blog);
        console.log("inside store found blog.id", blog.id);
        const updated = await blogService.update(
          //id, { ...blog, likes: blog.likes + 1 }
          blog,
        );
        set((state) => ({
          blogs: state.blogs
            .map((blog) => (blog.id === id ? updated : blog))
            .toSorted((a, b) => b.likes - a.likes),
        }));
        useNotificationStore
          .getState()
          .actions.setNotificationMessage(
            `You liked: "${updated.title} ${updated.author}"`,
            "success",
          );
        setTimeout(
          () =>
            useNotificationStore
              .getState()
              .actions.setNotificationMessage(null),
          5000,
        );
      },
      setFilter: (value) => set(() => ({ filter: value })),
    },
  })),
);

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
export const useNotification = () =>
  useNotificationStore((state) => state.notification);

export const useUserActions = () => useUserStore((state) => state.actions);
export const useUser = () => useUserStore((state) => state.user);
export const useAllUsers = () => useUserStore((state) => state.allUsers);

export const useBlogActions = () => useBlogStore((state) => state.actions);
export const useFilter = () => useBlogStore((state) => state.filter);
export const useBlogs = () => {
  const blogs = useBlogStore((state) => state.blogs).toSorted(
    (a, b) => b.votes - a.votes,
  );
  const filter = useBlogStore((state) => state.filter);
  if (filter)
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(filter.toLowerCase()),
    );
  return blogs;
};

//export default useAnecdoteStore
export default useBlogStore;
