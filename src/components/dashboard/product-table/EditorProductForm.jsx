'use client'

import { useState, useEffect } from 'react';
import Loading from '@/app/(main)/loading';
import ProductTitleInput from '@/components/dashboard/product-editor/ProductTitleInput';
import ProductDescriptionEditor from '@/components/dashboard/product-editor/ProductDescriptionEditor';
import ProductMediaUploader from '@/components/dashboard/product-editor/ProductMediaUploader';
import ProductPricingFields from '@/components/dashboard/product-editor/ProductPricingFields';
import ProductMetaFields from '@/components/dashboard/product-editor/ProductMetaFields';
import ProductColorsEditor from '@/components/dashboard/product-editor/ProductColorsEditor';
import ProductSEOEditor from '@/components/dashboard/product-editor/ProductSEOEditor';
import { productSchema } from '@/schemas/productSchema';

function EditorProductForm({ initialProduct }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [slugLoading, setSlugLoading] = useState(false);

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
  const [mediaFiles, setMediaFiles] = useState([]);
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

  // Handle media preview
  useEffect(() => {
    if (mediaFiles.length > 0) {
      const urls = mediaFiles.map(file => URL.createObjectURL(file));
      setMediaUrls(urls);
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    }
  }, [mediaFiles]);

  useEffect(() => {
    if (!slug) return;

    const checkSlug = async () => {
      setSlugLoading(true);
      try {
        const res = await fetch(`/api/check-slug?slug=${slug}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setIsSlugDuplicate(data.exists);
        setErrors(prev => ({ ...prev, slug: data.exists ? 'This slug is already taken' : '' }));
      } catch (error) {
        console.error('Error checking slug:', error);
        setErrors(prev => ({ ...prev, slug: 'Failed to check slug availability' }));
      } finally {
        setSlugLoading(false);
      }
    };

    const timeoutId = setTimeout(checkSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [slug]);

  useEffect(() => {
    if (!isSlugTouched && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugTouched]);

  useEffect(() => {
    if (!title && !description) return;

    try {
      const generatedTags = [
        ...title.toLowerCase().split(' '),
        ...description.toLowerCase().split(' ')
      ]
        .map(t => t.replace(/[^\w]/g, '').trim())
        .filter(t => t.length > 2)
        .slice(0, 10);

      setTags(generatedTags.join(', '));
      setAiSummary(`${title} - ${description.slice(0, 100)}...`);
    } catch (error) {
      console.error('Error generating tags and summary:', error);
    }
  }, [title, description]);

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugTouched(true);
    setErrors(prev => ({ ...prev, slug: '' }));
  };

  const generateSlug = (text) => {
    try {
      return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    } catch {
      return '';
    }
  };

  const handleGenerateSEO = () => {
    try {
      const featureList = features.split('\n').filter(Boolean).join(', ');
      const titleSEO = `${title} | Buy Online from ${brand} - Best Deals`;
      const descSEO = `Get ${title} from ${brand} in ${category}. Features: ${featureList}. Order now with fast delivery and best price!`;
      const keywordsSEO = [title, brand, category, 'buy', 'best price', 'discount', ...features.split('\n').filter(Boolean)];

      setSeoMeta({
        title: titleSEO,
        description: descSEO,
        keywords: keywordsSEO,
      });

      setSlug(generateSlug(title));
      setIsSlugTouched(false);
    } catch (error) {
      console.error('Error generating SEO:', error);
      alert('Failed to generate SEO metadata. Please try again.');
    }
  };

  const handleCopyLink = async () => {
    try {
      const fullLink = `https://apeila.com/product/${slug || 'product-slug'}`;
      await navigator.clipboard.writeText(fullLink);
      setCopySuccess(' Link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      setCopySuccess(' Failed to copy link');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const profit = price && costPerItem ? (Number(price) - Number(costPerItem)).toFixed(2) : 0;
  const margin = price && costPerItem ? ((profit / Number(price)) * 100).toFixed(2) : 0;

  const handleSave = async () => {
    setErrors({});

    if (!title.trim()) {
      setErrors(prev => ({ ...prev, name: 'Product name is required' }));
      return;
    }
    if (!category.trim()) {
      setErrors(prev => ({ ...prev, category: 'Category is required' }));
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrors(prev => ({ ...prev, price: 'Valid price is required' }));
      return;
    }
    if (isSlugDuplicate) {
      setErrors(prev => ({ ...prev, slug: 'Slug must be unique' }));
      return;
    }

    const productData = {
      name: title,
      slug,
      description,
      descriptionHTML: description,
      price: Number(price),
      oldPrice: Number(oldPrice) || undefined,
      discountPercentage: Number(discount) || undefined,
      costPerItem: Number(costPerItem) || undefined,
      category,
      brand,
      features: features.split('\n').filter(Boolean),
      sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      gallery: mediaUrls,
      youtubeLink,
      aiGeneratedSummary: aiSummary,
      seoMeta,
      colors,
      stock,
      inStockCount: Number(inStockCount),
      shippingFee: Number(shippingFee),
      deliveryDate,
      soldBy,
      giftOption,
      isNew,
      isFeatured,
    };

    const validation = productSchema.safeParse(productData);
    if (!validation.success) {
      const formErrors = {};
      validation.error.errors.forEach(err => {
        formErrors[err.path[0]] = err.message;
      });
      setErrors(formErrors);
      alert('Please fix validation errors before saving.');
      return;
    }

    setLoading(true);
    try {
      // ✅ Updated to new API endpoint
      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      alert('✅ Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      alert(`❌ Error adding product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className="max-w-3xl mx-auto bg-gray-50 p-4 rounded shadow"
      style={{ fontFeatureSettings: '"lnum"', fontFamily: 'Inter, sans-serif' }}
    >
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
      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

      <ProductDescriptionEditor description={description} setDescription={setDescription} />

      <ProductMediaUploader
        mediaFiles={mediaFiles}
        setMediaFiles={setMediaFiles}
        mediaUrls={mediaUrls}
        setMediaUrls={setMediaUrls}
      />

      <ProductColorsEditor colors={colors} setColors={setColors} />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">YouTube Video Link</label>
        <input
          type="text"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="https://youtube.com/watch?v=..."
        />
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
      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}

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
      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}

      <div className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} id="stock" />
        <label htmlFor="stock">In Stock</label>
      </div>

      <div className="mb-4">
        <label htmlFor="inStockCount" className="block text-sm font-medium mb-1">Stock Count</label>
        <input
          type="number"
          id="inStockCount"
          value={inStockCount}
          onChange={(e) => setInStockCount(Number(e.target.value))}
          className="w-full border rounded p-2"
          min={0}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="shippingFee" className="block text-sm font-medium mb-1">Shipping Fee ($)</label>
        <input
          type="number"
          id="shippingFee"
          value={shippingFee}
          onChange={(e) => setShippingFee(Number(e.target.value))}
          className="w-full border rounded p-2"
          min={0}
          step={0.01}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="deliveryDate" className="block text-sm font-medium mb-1">Delivery Date</label>
        <input
          type="date"
          id="deliveryDate"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="soldBy" className="block text-sm font-medium mb-1">Sold By</label>
        <input
          type="text"
          id="soldBy"
          value={soldBy}
          onChange={(e) => setSoldBy(e.target.value)}
          className="w-full border rounded p-2"
        />
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
      {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      {slugLoading && <p className="text-blue-500 text-sm mt-1">Checking slug availability...</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading || slugLoading || isSlugDuplicate}
          className={`mt-2 px-4 py-2 text-white rounded transition-colors ${
            loading || slugLoading || isSlugDuplicate ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </div>
    </div>
  );
}

export default EditorProductForm;