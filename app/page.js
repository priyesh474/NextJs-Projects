"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
// import api from "../services/api";
import BlogCard from "../components/BlogCard/BlogCard";
import Pagination from "../components/Pagination/Pagination";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("All");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
  
      if (!error) {
        setBlogs(data || []);
      }
    };
  
    fetchBlogs();
  }, []);
  

  const deleteFromUI = (id) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));
    return ["All", ...cats];
  }, [blogs]);

  const filtered = useMemo(() => {
    return blogs
      .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
      .filter((b) => (category === "All" ? true : b.category === category));
  }, [blogs, search, category]);

  // Paginate filtered results
  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
  }, [filtered, page, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    startTransition(() => {
      setPage(1);
    });
  }, [search, category]);

  return (
    <div className={styles.pageShell}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>Latest</div>
        <h1 className={styles.heroTitle}>Buying a Telescope</h1>
        <p className={styles.heroSubtitle}>Before you make your first purchase...</p>
        <div className={styles.heroActions}>
          <span className={styles.meta}>Blog</span>
          <span className={styles.meta}>Guides</span>
          <span className={styles.meta}>Astronomy</span>
        </div>
      </section>

      <section className={styles.controlsSection}>
        <div className={styles.filters}>
          <span className={styles.filtersLabel}>Blogs:</span>
          <div className={styles.categoryPills}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.pill} ${category === cat ? styles.pillActive : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.searchBar}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <button aria-label="Search" className={styles.searchBtn}>
            🔍
          </button>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className="blog-grid">
          {paginated.length > 0 ? (
            paginated.map((blog, index) => (
              <BlogCard
              key={`${blog.id}-${index}`}
                blog={blog}
                onDelete={deleteFromUI}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No blogs found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemsPerPage={itemsPerPage}
        totalItems={filtered.length}
      />
    </div>
  );
}
