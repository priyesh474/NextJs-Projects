import Link from "next/link";
import Image from "next/image";
import styles from "./BlogCard.module.css";
import api from "../../services/api";

export default function BlogCard({ blog, onDelete }) {
  const handleDelete = async () => {
    await api.delete(`/posts/${Number(blog.id)}`);
    onDelete(blog.id);
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
        <Image src={imageSrc} alt={blog.title} className={styles.image} width={300} height={180} />
        <span className={styles.badge}>{blog.category}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{blog.title}</h3>
      </div>

      <div className={styles.actions}>
        <Link href={`/blog/${blog.id}`} className={styles.linkPrimary}>
          View
        </Link>
        <Link href={`/add-edit-blog?id=${blog.id}`} className={styles.linkGhost}>
          Edit
        </Link>
        <button onClick={handleDelete} className={styles.dangerBtn}>
          Delete
        </button>
      </div>
    </article>
  );
}
