'use client';

import { useState, useEffect } from 'react';
import ProductTitleInput from '@/components/dashboard/product-editor/ProductTitleInput';
import ProductDescriptionEditor from '@/components/dashboard/product-editor/ProductDescriptionEditor';
import ProductMediaUploader from '@/components/dashboard/product-editor/ProductMediaUploader';
import ProductPricingFields from '@/components/dashboard/product-editor/ProductPricingFields';
import ProductMetaFields from '@/components/dashboard/product-editor/ProductMetaFields';
import ProductColorsEditor from '@/components/dashboard/product-editor/ProductColorsEditor';
import ProductSEOEditor from '@/components/dashboard/product-editor/ProductSEOEditor';

export default function ProductEditorForm({ initialProduct }) {
  const [title, setTitle] = useState(initialProduct?.name || '');
  const [tempTitle, setTempTitle] = useState(initialProduct?.name || '');
  const [isEditingTitleField, setIsEditingTitleField] = useState(false);
  const [description, setDescription] = useState(initialProduct?.descriptionHTML || '');
  const [price, setPrice] = useState(initialProduct?.price || '');
  const [oldPrice, setOldPrice] = useState(initialProduct?.oldPrice || '');
  const [discount, setDiscount] = useState(initialProduct?.discountPercentage || '');
  const [costPerItem, setCostPerItem] = useState(initialProduct?.costPerItem || '');
  const [category, setCategory] = useState(initialProduct?.category || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [features, setFeatures] = useState(initialProduct?.features?.join('\n') || '');
  const [sizes, setSizes] = useState(initialProduct?.sizes?.join(', ') || '');
  const [tags, setTags] = useState(initialProduct?.tags?.join(', ') || '');
  const [colors, setColors] = useState(initialProduct?.colors || []);
  const [aiSummary, setAiSummary] = useState(initialProduct?.aiGeneratedSummary || '');
  const [seoMeta, setSeoMeta] = useState(initialProduct?.seoMeta || { title: '', description: '', keywords: [] });
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [media, setMedia] = useState([]);
  const [mediaUrls, setMediaUrls] = useState(initialProduct?.gallery || []);
  const [youtubeLink, setYoutubeLink] = useState(initialProduct?.youtubeLink || '');
  const [isSlugDuplicate, setIsSlugDuplicate] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const [stock, setStock] = useState(initialProduct?.stock ?? true);
  const [inStockCount, setInStockCount] = useState(initialProduct?.inStockCount ?? 0);
  const [shippingFee, setShippingFee] = useState(initialProduct?.shippingFee ?? 0);
  const [deliveryDate, setDeliveryDate] = useState(initialProduct?.deliveryDate || '');
  const [soldBy, setSoldBy] = useState(initialProduct?.soldBy || '');
  const [giftOption, setGiftOption] = useState(initialProduct?.giftOption ?? false);
  const [isNew, setIsNew] = useState(initialProduct?.isNew ?? false);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);

  useEffect(() => {
    if (media.length > 0) {
      const urls = media.map(file => URL.createObjectURL(file));
      setMediaUrls(urls);
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    }
  }, [media]);

  useEffect(() => {
    if (!slug) return;
    const checkSlug = async () => {
      try {
        const res = await fetch(`/api/check-slug?slug=${slug}`);
        const data = await res.json();
        setIsSlugDuplicate(data.exists);
      } catch (error) {
        console.error('Error checking slug:', error);
      }
    };
    checkSlug();
  }, [slug]);

  useEffect(() => {
    if (!isSlugTouched && title) {
      const autoSlug = generateSlug(title);
      setSlug(autoSlug);
    }
  }, [title, isSlugTouched]);

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugTouched(true);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const handleGenerateSEO = () => {
    const featureList = features.split('\n').filter(Boolean).join(', ');
    const titleSEO = `${title} | Buy Online from ${brand} - Best Deals`;
    const descSEO = `Get ${title} from ${brand} in ${category}. Features: ${featureList}. Order now with fast delivery and best price!`;
    const keywordsSEO = [title, brand, category, 'buy', 'best price', 'discount', ...features.split('\n').filter(Boolean)];

    setSeoMeta({
      title: titleSEO,
      description: descSEO,
      keywords: keywordsSEO,
    });

    const newSlug = generateSlug(title);
    setSlug(newSlug);
    setIsSlugTouched(false);
  };

  const handleCopyLink = () => {
    const fullLink = `https://yourdomain.com/product/${slug || 'product-slug'}`;
    navigator.clipboard.writeText(fullLink).then(() => {
      setCopySuccess('✅ Link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const profit = price && costPerItem ? (Number(price) - Number(costPerItem)).toFixed(2) : 0;
  const margin = price && costPerItem ? ((profit / Number(price)) * 100).toFixed(2) : 0;

  const handleSave = async () => {
    const productData = {
      name: title,
      slug,
      description,
      descriptionHTML: description,
      price: Number(price),
      oldPrice: Number(oldPrice),
      discountPercentage: Number(discount),
      costPerItem: Number(costPerItem),
      category,
      brand,
      features: features.split('\n').filter(Boolean),
      sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      gallery: mediaUrls,
      youtubeLink,
      aiGeneratedSummary: aiSummary,
      seoMeta,
      colors,
      stock,
      inStockCount,
      shippingFee,
      deliveryDate,
      soldBy,
      giftOption,
      isNew,
      isFeatured,
    };

    try {
      const res = await fetch(`/api/products/update/${initialProduct.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert('✅ Product saved successfully!');
      } else {
        alert('❌ Failed to save product!');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('❌ Error saving product!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gray-50 p-4 rounded shadow" style={{ fontFeatureSettings: '"lnum"', fontFamily: 'Inter, sans-serif' }}>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <ProductTitleInput
        title={title}
        tempTitle={tempTitle}
        setTempTitle={setTempTitle}
        isEditing={isEditingTitleField}
        onEdit={() => setIsEditingTitleField(true)}
        onSave={() => {
          setTitle(tempTitle);
          setIsEditingTitleField(false);
          setIsSlugTouched(false);
        }}
        onCancel={() => {
          setTempTitle(title);
          setIsEditingTitleField(false);
        }}
      />

      <ProductDescriptionEditor description={description} setDescription={setDescription} />

      <ProductMediaUploader media={media} setMedia={setMedia} gallery={initialProduct?.gallery || []} setMediaUrls={setMediaUrls} />

      {/* ✅ رفع قسم الألوان مباشرة أسفل الميديا */}
      <ProductColorsEditor colors={colors} setColors={setColors} />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">YouTube Video Link</label>
        <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full border rounded p-2" />
      </div>

      <ProductPricingFields
        price={price}
        setPrice={setPrice}
        oldPrice={oldPrice}
        setOldPrice={setOldPrice}
        discount={discount}
        setDiscount={setDiscount}
        costPerItem={costPerItem}
        setCostPerItem={setCostPerItem}
        profit={profit}
        margin={margin}
      />

      <ProductMetaFields
        category={category}
        setCategory={setCategory}
        brand={brand}
        setBrand={setBrand}
        features={features}
        setFeatures={setFeatures}
        sizes={sizes}
        setSizes={setSizes}
        tags={tags}
        setTags={setTags}
        aiSummary={aiSummary}
        setAiSummary={setAiSummary}
      />

      <div className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} id="stock" />
        <label htmlFor="stock">In Stock</label>
      </div>

      <div className="mb-4">
        <label htmlFor="inStockCount" className="block text-sm font-medium mb-1">Stock Count</label>
        <input type="number" id="inStockCount" value={inStockCount} onChange={(e) => setInStockCount(Number(e.target.value))} className="w-full border rounded p-2" min={0} />
      </div>

      <div className="mb-4">
        <label htmlFor="shippingFee" className="block text-sm font-medium mb-1">Shipping Fee ($)</label>
        <input type="number" id="shippingFee" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} className="w-full border rounded p-2" min={0} step={0.01} />
      </div>

      <div className="mb-4">
        <label htmlFor="deliveryDate" className="block text-sm font-medium mb-1">Delivery Date</label>
        <input type="date" id="deliveryDate" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full border rounded p-2" />
      </div>

      <div className="mb-4">
        <label htmlFor="soldBy" className="block text-sm font-medium mb-1">Sold By</label>
        <input type="text" id="soldBy" value={soldBy} onChange={(e) => setSoldBy(e.target.value)} className="w-full border rounded p-2" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={giftOption} onChange={(e) => setGiftOption(e.target.checked)} id="giftOption" />
        <label htmlFor="giftOption">Gift Option</label>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} id="isNew" />
        <label htmlFor="isNew">New Product</label>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} id="isFeatured" />
        <label htmlFor="isFeatured">Featured Product</label>
      </div>

      <ProductSEOEditor
        title={title}
        features={features}
        brand={brand}
        category={category}
        slug={slug}
        seoMeta={seoMeta}
        setSeoMeta={setSeoMeta}
        isSlugDuplicate={isSlugDuplicate}
        handleGenerateSEO={handleGenerateSEO}
        handleCopyLink={handleCopyLink}
        handleSlugChange={handleSlugChange}
        copySuccess={copySuccess}
      />

      <div className="flex gap-2">
        <button onClick={handleSave} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
      </div>
    </div>
  );
}
