import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace", "comic-sans", "roboto", "inter"];
Quill.register(Font, true);

export const premiumQuillModules = {
  toolbar: [
    [{ font: Font.whitelist }],
    [{ size: ["small", false, "large", "huge"] }, { header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"]
  ]
};

export const premiumQuillFormats = [
  "font",
  "size",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "color",
  "background",
  "align",
  "list",
  "indent",
  "link",
  "image",
  "video"
];

export default function PremiumRichTextEditor({ value, onChange, placeholder, minHeightClass = "min-h-44" }) {
  return (
    <div className="premium-quill-shell mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={premiumQuillModules}
        formats={premiumQuillFormats}
        placeholder={placeholder}
        className={minHeightClass}
      />
    </div>
  );
}
