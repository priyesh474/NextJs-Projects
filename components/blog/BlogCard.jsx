import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import styles from "./BlogCard.module.css";

export default function BlogCard({ blog, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await supabase.from("posts").delete().eq("id", blog.id);
    onDelete(blog);
  };

  const imageSrc =
    blog.image &&
    (blog.image.startsWith("http://") ||
      blog.image.startsWith("https://") ||
      blog.image.startsWith("/"))
      ? blog.image
      : "/blog-default.png";

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={imageSrc}
          alt={blog.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        {blog.category && <span className={styles.category}>{blog.category}</span>}
        <h3 className={styles.title}>{blog.title}</h3>
      </div>

      <div
        className={`${styles.actions} ${confirming ? styles.actionsConfirm : ""}`}
        aria-live="polite"
      >
        {confirming ? (
          <>
            <span className={styles.confirmText}>Delete this entry?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`${styles.dangerBtn} ${styles.confirmBtn}`}
            >
              {deleting ? "Deleting…" : "Confirm"}
            </button>
            <button type="button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <Link href={`/blog/${blog.id}`} className={styles.linkPrimary}>
              View
            </Link>
            <Link href={`/add-edit-blog?id=${blog.id}`} className={styles.linkGhost}>
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={styles.dangerBtn}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}
