'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlock from '@tiptap/extension-code-block';
import { useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Link as LinkIcon, Image as ImageIcon, Video, Code2, Table as TableIcon,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

const editorExtensions = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: false }),
  Placeholder.configure({ placeholder: 'Write the product description here...' }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Color,
  TextStyle,
  Image,
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  CodeBlock,
];

export default function ProductDescriptionEditor({ description, setDescription, productSlug }) {
  const [modalType, setModalType] = useState(null);
  const [modalValue, setModalValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  if (!editor) return null;

  const openModal = (type) => {
    setModalType(type);
    setModalValue('');
    setIsModalOpen(true);
  };

  const insertModalContent = async () => {
    if (modalType === 'image' && file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productSlug', productSlug);

      try {
        const res = await fetch('/api/upload/description', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        } else {
          alert(data.error || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else if (modalType === 'link') {
      editor.chain().focus().setLink({ href: modalValue }).run();
    } else if (modalType === 'video') {
      editor.commands.setContent(editor.getHTML() + `<iframe src="${modalValue}" frameborder="0" allowfullscreen></iframe>`);
    }
    setIsModalOpen(false);
    setFile(null);
    setModalValue('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Description</label>
      <div className="border rounded bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 border-b p-2 items-center">
          <select
            className="border px-2 py-1 rounded text-sm"
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'paragraph') editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
            }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>

          <button onClick={() => editor.chain().focus().toggleBold().run()} className="toolbar-btn"><Bold size={16} /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className="toolbar-btn"><Italic size={16} /></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="toolbar-btn"><UnderlineIcon size={16} /></button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="toolbar-btn"><List size={16} /></button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="toolbar-btn"><ListOrdered size={16} /></button>
          <button onClick={() => openModal('link')} className="toolbar-btn"><LinkIcon size={16} /></button>
          <button onClick={() => editor.chain().focus().unsetLink().run()} className="toolbar-btn">✖</button>
          <button onClick={() => openModal('image')} className="toolbar-btn"><ImageIcon size={16} /></button>
          <button onClick={() => openModal('video')} className="toolbar-btn"><Video size={16} /></button>
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="toolbar-btn"><Code2 size={16} /></button>
          <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} className="toolbar-btn"><TableIcon size={16} /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className="toolbar-btn"><AlignLeft size={16} /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className="toolbar-btn"><AlignCenter size={16} /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className="toolbar-btn"><AlignRight size={16} /></button>
          <button onClick={() => editor.chain().focus().undo().run()} className="toolbar-btn"><Undo2 size={16} /></button>
          <button onClick={() => editor.chain().focus().redo().run()} className="toolbar-btn"><Redo2 size={16} /></button>
        </div>

        {/* Content */}
        <EditorContent editor={editor} className="min-h-[200px] prose max-w-full p-2" />
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-4 rounded shadow-lg space-y-4 w-full max-w-sm">
            <Dialog.Title className="text-lg font-medium">
              {modalType === 'image' ? 'Upload Image' : `Insert ${modalType}`}
            </Dialog.Title>

            {modalType === 'image' ? (
              <input type="file" onChange={handleFileChange} className="w-full" />
            ) : (
              <input
                type="text"
                placeholder="Enter URL..."
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            )}

            <button onClick={insertModalContent} className="bg-main text-white px-3 py-1 rounded w-full">
              Insert
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <style jsx>{`
        .toolbar-btn {
          background: #f3f3f3;
          border: none;
          padding: 5px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .toolbar-btn:hover {
          background: #e2e2e2;
        }
      `}</style>
    </div>
  );
}
