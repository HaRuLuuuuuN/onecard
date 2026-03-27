'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Image as ImageIcon,
  Link as LinkIcon, Undo, Redo,
} from 'lucide-react';

interface RichEditorProps {
  value: string;       // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick, active, title, children,
}: {
  onClick: () => void; active?: boolean; title?: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: placeholder ?? '本文を入力してください...',
      }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[400px] prose-custom',
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('画像URLを入力してください');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt('URLを入力してください');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-950 focus-within:border-yellow-500/50 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-800 bg-gray-900">
        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="元に戻す">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="やり直す">
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="見出し1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="見出し2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="見出し3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="太字"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="斜体"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="箇条書き"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="番号リスト"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="引用"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="区切り線"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Media */}
        <ToolbarButton onClick={addImage} title="画像を挿入">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="リンクを挿入"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="px-6 py-5 text-gray-100 note-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
