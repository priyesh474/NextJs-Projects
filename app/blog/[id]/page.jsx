"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
// import api from "../../../services/api";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!id) return;
  //   api.get(`/posts/${Number(id)}`)
  //     .then((res) => setBlog(res.data))
  //     .finally(() => setLoading(false));
  // }, [id]);

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

  if (loading) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={`${styles.skeletonBase} ${styles.skeletonImg}`} />
          <div className={`${styles.skeletonBase} ${styles.skeletonTitle}`} />
          <div className={`${styles.skeletonBase} ${styles.skeletonText}`} />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <h2 style={{ margin: 0, color: "var(--text)" }}>Blog not found</h2>
          <p style={{ opacity: 0.8, color: "var(--text)" }}>
            Please go back and try another post.
          </p>
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
            style={{ objectFit: "cover" }}
            sizes="800px"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className={styles.badge}>{blog.category || "Uncategorized"}</div>
          <h1 className={styles.title}>{blog.title}</h1>
          <p className={styles.content}>{blog.content}</p>
        </div>
      </article>
    </div>
  );
}
