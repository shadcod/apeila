console.log("🚀 AliExpress Content Script Loaded!");

const addButton = document.createElement('button');
addButton.innerText = "🟢 أضف إلى موقعي";
addButton.style.position = "fixed";
addButton.style.top = "120px";
addButton.style.right = "20px";
addButton.style.zIndex = 9999;
addButton.style.padding = "10px 15px";
addButton.style.backgroundColor = "#28a745";
addButton.style.color = "#fff";
addButton.style.border = "none";
addButton.style.borderRadius = "5px";
addButton.style.cursor = "pointer";
addButton.style.fontFamily = "Tahoma, sans-serif";
addButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

addButton.onclick = async () => {
  try {
    console.log("🔎 زر الإضافة تم الضغط عليه!");

    const titleEl = document.querySelector('h1[data-pl="product-title"]') || document.querySelector('h1.product-title-text') || document.querySelector('h1.product-title') || document.querySelector('h1');
    const priceEl = document.querySelector('.product-price-value') || document.querySelector('.product-price-current') || document.querySelector('.product-price');
    const imageEls = document.querySelectorAll('.images-view-item img, .images-view-list img');
    const colorEls = document.querySelectorAll('.sku-property-item img');
    const sizeEls = document.querySelectorAll('.sku-property-text');
    const descEl = document.querySelector('.product-detail-full') || document.querySelector('.product-description') || document.querySelector('#product-description');

    const videoEl = document.querySelector('video source') || document.querySelector('video') || document.querySelector('iframe');
    const videoUrl = videoEl ? (videoEl.src || videoEl.getAttribute('src') || videoEl.getAttribute('data-src')) : '';

    const ratingEl = document.querySelector('.overview-rating-average');
    const rating = ratingEl ? parseFloat(ratingEl.innerText.trim()) : 0;

    if (!titleEl || !priceEl || imageEls.length === 0) {
      alert("❌ لم يتم العثور على معلومات المنتج! تأكد أنك في صفحة منتج علي إكسبرس.");
      return;
    }

    const title = titleEl.innerText.trim();
    const rawPrice = priceEl.innerText.replace(/[\n\r]+/g, '').trim();
    const cleanPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;

    const images = Array.from(imageEls).map(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      return src.replace(/_50x50\.jpg$/, '_640x640.jpg').split(' ')[0];
    }).filter(src => src);

    const colors = Array.from(colorEls).map(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
      return {
        name: "Color",
        code: "#000000", // لا يوجد كود حقيقي بالأصل في علي إكسبرس، إذا تحب لاحقاً تستخرج اللون من اسم الخيار
        image: src.replace(/_50x50\.jpg$/, '_640x640.jpg').split(' ')[0],
      };
    }).filter(c => c.image);

    const sizes = Array.from(sizeEls).map(el => el.innerText.trim()).filter(text => text);

    let description = descEl ? descEl.innerHTML.trim() : "";
    // إزالة iframes أو أزرار زائدة
    description = description.replace(/<iframe.*?<\/iframe>/g, '').replace(/<button.*?<\/button>/g, '');

    // توليد slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // تجهيز الكائن النهائي
    const productData = {
      name: title,
      slug: slug,
      barcode: "NA",
      brand: "AliExpress",
      category: "Imported",
      subcategory: "AliExpress",
      price: cleanPrice,
      oldPrice: cleanPrice,
      discountPercentage: 0,
      description: description,
      descriptionHTML: description,
      specifications: {
        processor: "",
        ram: "",
        storage: "",
        battery: "",
        display: "",
      },
      gallery: images,
      colors: colors,
      media: {
        images: images,
        videos: videoUrl ? [videoUrl] : [],
      },
      features: [],
      options: {
        warrantyOptions: [
          { period: "1 year", price: 0 },
          { period: "2 years", price: 50 }
        ]
      },
      stock: true,
      inStockCount: 10,
      rating: rating,
      reviewsCount: 0,
      shippingFee: 25,
      seoMeta: {
        title: `${title} - Apeila.com`,
        description: `${title} imported from AliExpress with special offer`,
        keywords: ["AliExpress", "imported", title],
      },
      translations: {
        en: {
          name: title,
          description: "Imported product from AliExpress",
        },
        ar: {
          name: title,
          description: "منتج مستورد من علي إكسبرس",
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      sourceUrl: window.location.href,
      sizes: sizes,
    };

    // ✅ إنشاء Popup معاينة
    const modal = document.createElement('div');
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "10000";

    const content = document.createElement('div');
    content.style.background = "#fff";
    content.style.padding = "20px";
    content.style.borderRadius = "10px";
    content.style.width = "250px";
    content.style.maxHeight = "90%";
    content.style.overflowY = "auto";
    content.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
    content.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    content.style.textAlign = "center";

    let colorsHtml = '';
    colors.forEach(c => {
      colorsHtml += `<img src="${c.image}" style="width:28px; height:28px; border-radius:50%; margin:2px; border:1px solid #ddd;" />`;
    });

    content.innerHTML = `
      <h2 style="margin-top:0; color:#333;">معاينة المنتج</h2>
      <img src="${images[0]}" style="width:150px; height:auto; border-radius:8px; margin-bottom:10px; box-shadow:0 2px 8px rgba(0,0,0,0.2);" />
      <strong>الاسم:</strong> <div style="margin-bottom:5px;">${title}</div>
      <strong>السعر:</strong> $${cleanPrice}<br>
      <strong>التقييم:</strong> ${rating}<br>
      <strong>الألوان:</strong><div style="display:flex; justify-content:center; flex-wrap:wrap; margin-bottom:5px;">${colorsHtml}</div>
      <strong>عدد الأحجام:</strong> ${sizes.length}<br>
      <div style="margin-top: 15px;">
        <button id="sendBtn" style="background-color: #28a745; color: white; padding: 10px 18px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">إرسال ✅</button>
        <button id="cancelBtn" style="background-color: #dc3545; color: white; padding: 10px 18px; border: none; border-radius: 6px; cursor: pointer;">إلغاء ❌</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('cancelBtn').onclick = () => {
      document.body.removeChild(modal);
      console.log("❌ تم الإلغاء من قبل المستخدم");
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        console.log("❌ تم الإغلاق بالنقر على الخلفية");
      }
    };

    document.getElementById('sendBtn').onclick = async () => {
      console.log("✅ Sending product data:", productData);

      try {
        const res = await fetch('https://apeila-me.vercel.app/api/products/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (!res.ok) {
          const errorText = await res.text();
          alert("❌ فشل إرسال البيانات إلى قاعدة البيانات!");
          console.error(errorText);
          return;
        }

        alert("✅ تم إرسال المنتج إلى قاعدة البيانات بنجاح!");
        document.body.removeChild(modal);
      } catch (err) {
        console.error("❌ خطأ في الإرسال:", err);
        alert("❌ حصل خطأ أثناء محاولة الإرسال!");
      }
    };

  } catch (err) {
    console.error("❌ خطأ أثناء المعالجة:", err);
    alert("❌ حصل خطأ أثناء محاولة المعالجة!");
  }
};

document.body.appendChild(addButton);
