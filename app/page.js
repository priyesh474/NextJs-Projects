"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";
import { POSTS_PER_PAGE } from "@/lib/constants";
import styles from "./page.module.css";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

async function restorePost(blog) {
  const { id, ...fields } = blog;

  const first = await supabase
    .from("posts")
    .insert([{ id, ...fields }])
    .select()
    .single();

  if (!first.error) return first.data;

  // Fall back to letting the database assign the id.
  const retry = await supabase
    .from("posts")
    .insert([fields])
    .select()
    .single();

  return retry.error ? null : retry.data;
}

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const itemsPerPage = POSTS_PER_PAGE;

  useEffect(() => {
    let active = true;

    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setStatus("error");
        return;
      }

      setBlogs(data || []);
      setStatus("ready");
    };

    fetchBlogs();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = (blog) => {
    setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    setToast({ message: `“${blog.title}” was deleted.`, blog });
  };

  const handleUndo = async () => {
    const blog = toast?.blog;
    if (!blog) return;

    const restored = await restorePost(blog);

    if (!restored) {
      setToast({ message: "Could not restore that entry." });
      return;
    }

    setBlogs((prev) => [restored, ...prev]);
    setToast({ message: "Entry restored." });
  };

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(blogs.map((b) => b.category).filter(Boolean))
    );
    return ["All", ...unique];
  }, [blogs]);

  const recentBlogs = useMemo(() => {
    return [...blogs]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4);
  }, [blogs]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return blogs
      .filter((b) => (term ? b.title.toLowerCase().includes(term) : true))
      .filter((b) =>
        selectedFilter === "All" ? true : b.category === selectedFilter
      );
  }, [blogs, search, selectedFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Return to the first page whenever the result set is narrowed.
  useEffect(() => {
    startTransition(() => {
      setPage(1);
    });
  }, [search, selectedFilter]);

  return (
    <div className={styles.pageShell}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Featured · Latest</span>
          <h1 className={styles.heroTitle}>Buying a Telescope</h1>
          <p className={styles.heroSubtitle}>
            Before you make your first purchase, learn what actually matters in
            a first scope — aperture, mounts, and the night sky you can reach.
          </p>
          <div className={styles.heroMeta}>
            <span>Blog</span>
            <span>Guides</span>
            <span>Astronomy</span>
          </div>
        </div>
        <div
          className={styles.heroImage}
          role="img"
          aria-label="A telescope pointed at the night sky"
        />
      </section>

      <section className={styles.controlsSection} aria-label="Archive filters">
        <div className={styles.filters}>
          <div className={styles.filterField}>
            <label className={styles.filtersLabel} htmlFor="category-filter">
              Category
            </label>
            <select
              id="category-filter"
              className={styles.filterSelect}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.categoryPills} role="group" aria-label="Sections">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.pill} ${
                  selectedFilter === cat ? styles.pillActive : ""
                }`}
                onClick={() => setSelectedFilter(cat)}
                aria-pressed={selectedFilter === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.searchBar}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.6-3.6" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the archive"
            aria-label="Search blogs"
          />
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className={styles.blogGridSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              {selectedFilter === "All" ? "Latest entries" : selectedFilter}
            </h2>
            <p className={styles.resultCount}>
              {status === "loading"
                ? "Loading…"
                : `${filtered.length} ${
                    filtered.length === 1 ? "entry" : "entries"
                  }`}
            </p>
          </div>

          <div className={styles.grid}>
            {status === "loading" ? (
              <div className={styles.emptyState} role="status">
                <p>Loading entries…</p>
              </div>
            ) : paginated.length > 0 ? (
              paginated.map((blog, index) => (
                <BlogCard
                  key={`${blog.id}-${index}`}
                  blog={blog}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>
                  {status === "error"
                    ? "The archive could not be loaded. Please try again."
                    : "No blogs found. Try adjusting your search or filters."}
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className={styles.blogSidebar} aria-labelledby="recent-blogs-title">
          <h2 className={styles.sidebarTitle} id="recent-blogs-title">
            Recent blogs
          </h2>

          {recentBlogs.length > 0 ? (
            <ol className={styles.sidebarRecent}>
              {recentBlogs.map((blog) => (
                <li key={blog.id} className={styles.sidebarItem}>
                  <Link href={`/blog/${blog.id}`} className={styles.sidebarLink}>
                    <span className={styles.sidebarCategory}>
                      {blog.category || "Entry"}
                    </span>
                    <span className={styles.sidebarItemTitle}>{blog.title}</span>
                    {blog.created_at && (
                      <time
                        className={styles.sidebarDate}
                        dateTime={blog.created_at}
                      >
                        {dateFormatter.format(new Date(blog.created_at))}
                      </time>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.sidebarEmpty}>
              {status === "loading" ? "Loading…" : "No entries yet."}
            </p>
          )}
        </aside>
      </section>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemsPerPage={itemsPerPage}
        totalItems={filtered.length}
      />

      {toast && (
        <Toast
          message={toast.message}
          onClose={() => setToast(null)}
          actionLabel={toast.blog ? "Undo" : undefined}
          onAction={toast.blog ? handleUndo : undefined}
          duration={toast.blog ? 6000 : 4000}
        />
      )}
    </div>
  );
}
