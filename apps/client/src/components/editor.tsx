import {
  useEditor,
  EditorContent,
  type Editor as EditorType,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const extensions = [StarterKit];

const Editor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const editor = useEditor({
    extensions: extensions,
    content,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[200px] border-input bg-background py-3 px-4 editor",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });
  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="editor" />
    </div>
  );
};

const Toolbar = ({ editor }: { editor: EditorType | null }) => {
  if (!editor) return null;

  return (
    <div className="border border-input bg-transparent rounded-md p-1 mb-1">
      <Toggle
        size={"sm"}
        pressed={editor.isActive("heading")}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 size={20} />
      </Toggle>

      <Toggle
        size={"sm"}
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={20} />
      </Toggle>

      <Toggle
        size={"sm"}
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={20} />
      </Toggle>

      <Toggle
        size={"sm"}
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={20} />
      </Toggle>

      <Toggle
        size={"sm"}
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={20} />
      </Toggle>

      <Toggle
        size={"sm"}
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={20} />
      </Toggle>
    </div>
  );
};

export default Editor;
