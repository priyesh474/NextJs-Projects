"use client";

import { useEffect, useState } from "react";
import Toast from "../Toast/Toast";
import { useRouter } from "next/navigation";
import styles from "./BlogForm.module.css";
import { supabase } from "@/lib/supabase";


export default function BlogForm({ blogId }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", image: "", category: "", content: "",});

  const [toast, setToast] = useState("");
  
  const clearToast = () => {
    setToast("");
  };
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localPreview, setLocalPreview] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (!blogId) return;
  
    const fetchBlog = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", blogId)
        .single();
  
      if (data) {
        setForm({
          title: data.title,
          image: data.image,
          category: data.category,
          content: data.content,
        });
      }
    };
  
    fetchBlog();
  }, [blogId]);
  

  useEffect(() => {
    if (!blogId) {
      setForm({
        title: "",
        image: "",
        category: "",
        content: "",
      });
      setLocalPreview("");
      setToast("");
    }
  }, [blogId]);
  

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const validateForm = () => {
    const newErrors = {};
  
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
  
    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }
  
    if (!form.content.trim()) {
      newErrors.content = "Content is required";
    } else if (form.content.trim().length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }
  
    if (!blogId && !form.image) {
      newErrors.image = "Cover image is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  
  
  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setSaving(true);
  
    try {
      if (blogId) {
        // UPDATE
        await supabase
          .from("posts")
          .update({
            title: form.title,
            image: form.image,
            category: form.category,
            content: form.content,
          })
          .eq("id", blogId);
      } else {
        // CREATE
        await supabase.from("posts").insert([
          {
            title: form.title,
            image: form.image,
            category: form.category,
            content: form.content,
          },
        ]);
      }
  
      setToast(blogId ? "Blog Updated" : "Blog Added");
  
      setTimeout(() => {
        router.push("/");
      }, 800);
    } finally {
      setSaving(false);
    }
  };
  
  
  

  const uploadLocalImage = async (file) => {
    if (!file) return;
  
    setUploading(true);
    setToast("");
  
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
  
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;
  
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);
  
      if (uploadError) throw uploadError;
  
      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);
  
      setForm((prev) => ({
        ...prev,
        image: data.publicUrl,
      }));
  
      setToast("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      setToast("Image upload failed");
      setForm((prev) => ({ ...prev, image: "" }));
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <>
      <div className={styles.shell}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{blogId ? "Edit blog" : "Create a new blog"}</h2>
            <p className={styles.subtitle}>Add a cover image, category and content.</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={submitHandler}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input
                className={styles.input}
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
              />
              {errors.title && <p className={styles.error}>{errors.title}</p>}

            </div>

            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <input
                className={styles.input}
                value={form.category}
                onChange={(e) => {
                  setForm({ ...form, category: e.target.value });
                  setErrors((prev) => ({ ...prev, category: "" }));
                }}
              />
              {errors.category && <p className={styles.error}>{errors.category}</p>}

            </div>
          </div>

          <div className={styles.uploader}>
            <div className={styles.uploaderTop}>
              <div>
                <div className={styles.label}>Cover image</div>
                <p className={styles.help}>
                  Upload from your computer (saved locally to `public/uploads/...`).
                </p>
              </div>

              <label className={styles.fileBtn}>
                <input
                  className={styles.fileInput}
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadLocalImage(e.target.files?.[0])}
                />
                {uploading ? "Uploading..." : "Choose image"}
              </label>
              {errors.image && <p className={styles.error}>{errors.image}</p>}
            </div>

            <div className={styles.previewRow}>
              <div className={styles.preview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={localPreview || form.image || "/blog-default.png"}
                  alt="Cover preview"
                  className={styles.previewImg}
                />
              </div>

              <div className={styles.previewMeta}>
                <div className={styles.metaLabel}>Stored URL</div>
                <code className={styles.metaValue}>
                  {form.image ? form.image : "No image uploaded yet"}
                </code>
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Content</label>
            <textarea
              className={styles.textarea}
              value={form.content}
              onChange={(e) => {
                setForm({ ...form, content: e.target.value });
                setErrors((prev) => ({ ...prev, content: "" }));
              }}
            />
            {errors.content && <p className={styles.error}>{errors.content}</p>}

          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={uploading || saving}
            >
              {saving ? "Saving..." : blogId ? "Update blog" : "Publish blog"}
            </button>
          </div>
      </form>
      </div>

      {toast && <Toast message={toast} onClose={clearToast} />}
    </>
  );
}
