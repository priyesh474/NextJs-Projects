"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setBlog(data);
      }

      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  const imageSrc =
    blog?.image &&
    (blog.image.startsWith("http://") ||
      blog.image.startsWith("https://") ||
      blog.image.startsWith("/"))
      ? blog.image
      : "/blog-default.png";

  const published = blog?.created_at
    ? new Date(blog.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (loading) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={`${styles.skeleton} ${styles.skeletonImg}`} />
          <div className={styles.body}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} />
            <div className={`${styles.skeleton} ${styles.skeletonTextShort}`} />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.body}>
            <h2 className={styles.notFoundTitle}>Blog not found</h2>
            <p className={styles.notFoundText}>
              Please go back and try another post.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          <Image
            src={imageSrc}
            alt={blog.title}
            fill
            sizes="(max-width: 820px) 100vw, 820px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.badge}>{blog.category || "Uncategorized"}</div>
          <h1 className={styles.title}>{blog.title}</h1>
          {published && <p className={styles.meta}>{published}</p>}
          <p className={styles.content}>{blog.content}</p>
        </div>
      </article>
    </div>
  );
}
