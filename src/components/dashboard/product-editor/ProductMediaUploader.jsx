'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Trash2, Star, Edit2 } from 'lucide-react';
import { ReactSortable } from 'react-sortablejs';
import toast from 'react-hot-toast';

export default function ProductMediaUploader({ mediaUrls = [], setMediaUrls }) {
  const [previewItems, setPreviewItems] = useState([]);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingImageIdx, setEditingImageIdx] = useState(null);
  const [editingImageUrl, setEditingImageUrl] = useState('');
  const [ImageEditor, setImageEditor] = useState(null);
  const [loadingEditor, setLoadingEditor] = useState(false);

  const editorContainerRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    import('tui-image-editor').then((mod) => {
      setImageEditor(() => mod.default);
      import('tui-image-editor/dist/tui-image-editor.css');
    });
  }, []);

  useEffect(() => {
    if (mediaUrls.length > 0) {
      const items = mediaUrls.map((url) => ({
        id: uuidv4(),
        type: url.endsWith('.mp4') ? 'video' : 'image',
        url,
        file: null,
      }));
      setPreviewItems(items);
      setMainImageIdx(0);
    }
  }, [mediaUrls]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload/media', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.url) {
          uploadedUrls.push({
            id: uuidv4(),
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: data.url,
            file: null,
          });
        }
      } catch (err) {
        console.error('Upload error:', err);
        toast.error('Failed to upload file.');
      }
    }

    const updated = [...previewItems, ...uploadedUrls];
    setPreviewItems(updated);
    setMediaUrls(updated.map((item) => item.url));
    if (mainImageIdx === null && updated.length > 0) setMainImageIdx(0);
  };

  const handleRemove = (index) => {
    const updated = [...previewItems];
    updated.splice(index, 1);
    setPreviewItems(updated);
    setMediaUrls(updated.map((item) => item.url));
    if (mainImageIdx === index) setMainImageIdx(null);
    else if (mainImageIdx > index) setMainImageIdx(mainImageIdx - 1);
  };

  const handleAddUrl = () => {
    if (!newUrl) return;
    const type = newUrl.endsWith('.mp4') ? 'video' : 'image';
    const newItem = {
      id: uuidv4(),
      type,
      url: newUrl,
      file: null,
    };
    const updated = [...previewItems, newItem];
    setPreviewItems(updated);
    setMediaUrls(updated.map((item) => item.url));
    if (mainImageIdx === null && updated.length > 0) setMainImageIdx(0);
    setNewUrl('');
    setShowUrlInput(false);
  };

  const handleSaveEdited = () => {
    const dataUrl = editorInstanceRef.current.toDataURL();
    const updatedItems = [...previewItems];
    updatedItems[editingImageIdx].url = dataUrl;
    updatedItems[editingImageIdx].file = null;
    setPreviewItems(updatedItems);
    setMediaUrls(updatedItems.map((item) => item.url));
    setEditorOpen(false);
    toast.success('Image updated successfully');
  };

  useEffect(() => {
    if (ImageEditor && editorContainerRef.current && editorOpen && editingImageUrl) {
      setLoadingEditor(true);
      setTimeout(() => {
        editorInstanceRef.current = new ImageEditor(editorContainerRef.current, {
          includeUI: {
            loadImage: { path: editingImageUrl, name: 'Selected Image' },
            menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
            initMenu: 'filter',
            uiSize: { width: '1000px', height: '700px' },
            menuBarPosition: 'bottom',
          },
          cssMaxWidth: 700,
          cssMaxHeight: 500,
          selectionStyle: {
            cornerSize: 20,
            rotatingPointOffset: 70,
          },
        });
        setLoadingEditor(false);
      }, 200);
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [ImageEditor, editorOpen, editingImageUrl]);

  const getValidUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('https')) return url;
    if (url.startsWith('/img') || url.startsWith('img')) return `/${url.replace(/^\/?/, '')}`;
    return `/uploads/${url}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Media</label>

      <div className="flex gap-4">
        <div
          className="relative flex-1 min-h-[400px] border rounded bg-white overflow-hidden shadow-inner"
          style={{ position: 'relative', width: '100%', height: '400px' }}
        >
          {previewItems[mainImageIdx] ? (
            previewItems[mainImageIdx].type === 'image' ? (
              <img
                src={getValidUrl(previewItems[mainImageIdx].url)}
                alt="Main"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <video
                src={getValidUrl(previewItems[mainImageIdx].url)}
                controls
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No image selected
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 w-48">
          <ReactSortable
            list={previewItems}
            setList={(newState) => {
              setPreviewItems(newState);
              setMediaUrls(newState.map((item) => item.url));
            }}
            className="grid grid-cols-2 gap-2"
          >
            {previewItems.map((item, idx) => (
              <div
                key={item.id}
                className={`relative w-full h-24 border rounded overflow-hidden bg-white cursor-pointer shadow transition
                  ${mainImageIdx === idx ? 'ring-2 ring-green-600' : ''}`}
                onClick={() => setMainImageIdx(idx)}
                style={{ position: 'relative', width: '100%', height: '96px' }}
              >
                {item.type === 'image' ? (
                  <img
                    src={getValidUrl(item.url)}
                    alt={`media-${idx}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <video
                    src={getValidUrl(item.url)}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}

                {mainImageIdx === idx && (
                  <div className="absolute bottom-1 left-1 bg-green-600 text-white text-[10px] px-1 rounded flex items-center gap-0.5">
                    <Star size={10} /> Main
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded p-0.5 hover:bg-red-700 transition"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>

                {item.type === 'image' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingImageIdx(idx);
                      setEditingImageUrl(getValidUrl(item.url));
                      setEditorOpen(true);
                    }}
                    className="absolute top-1 left-1 bg-gray-800 text-white p-0.5 rounded hover:bg-gray-700 transition"
                    title="Edit image"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </ReactSortable>

          <label
            className="flex flex-col items-center justify-center border rounded w-full h-24 cursor-pointer hover:bg-gray-50 transition"
          >
            <Upload size={20} className="text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Add</span>
            <input
              type="file"
              accept="image/*,video/mp4"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            className="text-blue-600 text-xs underline hover:text-blue-800 transition"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            Add from URL
          </button>

          {showUrlInput && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition"
              >
                Add URL
              </button>
            </div>
          )}
        </div>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          {loadingEditor && <p className="text-white">Loading editor...</p>}
          <div ref={editorContainerRef} style={{ width: '1000px', height: '700px' }}></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleSaveEdited} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setEditorOpen(false)} className="bg-red-600 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
