import {
  Bold,
  Italic,
  Underline as UnderLineIcon,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Undo2,
  Redo2,
  Heading,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editorClassName?: string;
  disabled?: boolean;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  editorClassName,
  disabled = false,
}) => {
  const [_, forceRender] = useState(0);
  const safeValue = value ?? '';

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class:
              "relative italic text-gray-700 pl-6 before:content-['\"'] before:absolute before:left-0 before:text-3xl after:content-['\"']",
          },
        },
        bulletList: {
          HTMLAttributes: { class: 'list-disc ml-4' },
        },
        orderedList: {
          HTMLAttributes: { class: 'list-decimal ml-4' },
        },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: safeValue,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose px-4 py-2 min-h-[120px] outline-none',
        placeholder,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const rerender = () => forceRender((n) => n + 1);

    editor.on('selectionUpdate', rerender);
    editor.on('transaction', rerender);
    editor.on('focus', rerender);
    editor.on('blur', rerender);

    return () => {
      editor.off('selectionUpdate', rerender);
      editor.off('transaction', rerender);
      editor.off('focus', rerender);
      editor.off('blur', rerender);
    };
  }, [editor]);

  useEffect(() => {
    if (editor && safeValue !== editor.getHTML()) {
      editor.commands.setContent(safeValue);
    }
  }, [safeValue, editor]);

  if (!editor) return null;

  return (
    <div
      className={cn('border rounded-md bg-white', {
        editorClassName,
      })}
    >
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b items-center">
        <button
          type="button"
          title="Undo"
          disabled={disabled}
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1"
        >
          <Undo2 size={14} />
        </button>
        <button
          type="button"
          title="Redo"
          disabled={disabled}
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1"
        >
          <Redo2 size={14} />
        </button>
        <span className="w-px h-4 bg-gray-200 mx-2" />
        <button
          type="button"
          title="Bold"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          title="Italic"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          disabled={disabled}
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        >
          <UnderLineIcon size={14} />
        </button>
        <button
          type="button"
          title="Code"
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
        >
          <Code size={14} />
        </button>
        <span className="w-px h-4 bg-gray-200 mx-2" />
        <button
          disabled={disabled}
          type="button"
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <List size={14} />
        </button>
        <button
          disabled={disabled}
          type="button"
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          <ListOrdered size={14} />
        </button>
        <button
          disabled={disabled}
          type="button"
          title="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        >
          <Quote size={14} />
        </button>
        <span className="w-px h-4 bg-gray-200 mx-2" />
        <button
          disabled={disabled}
          type="button"
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading size={14} />
        </button>
        <span className="w-px h-4 bg-gray-200 mx-2" />
        <button
          disabled={disabled}
          type="button"
          title="Link"
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }}
          className={`p-1 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        >
          <LinkIcon size={14} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
