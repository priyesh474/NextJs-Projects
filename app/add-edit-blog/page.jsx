"use client";

import BlogForm from "../../components/BlogForm/BlogForm";
import { useSearchParams } from "next/navigation";

export default function AddEditBlog() {
  const params = useSearchParams();
  const id = params.get("id");

  return <BlogForm blogId={id} />;
}
