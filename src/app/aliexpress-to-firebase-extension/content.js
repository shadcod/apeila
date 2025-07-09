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

    const titleEl = 
      document.querySelector('h1[data-pl="product-title"]') ||
      document.querySelector('h1.product-title-text') ||
      document.querySelector('h1.product-title') ||
      document.querySelector('h1') ||
      document.querySelector('[class*="title"]');

    const priceEl = 
      document.querySelector('.product-price-value') ||
      document.querySelector('.product-price-current') ||
      document.querySelector('.product-price') ||
      document.querySelector('[class*="price"]');

    const imageEls = document.querySelectorAll(
      '.images-view-item img, .images-view-list img, .sku-image-list img, [class*="image"] img'
    );

    const colorEls = document.querySelectorAll(
      '.sku-property-item img, .sku-property-color img, [class*="sku"] img'
    );

    const sizeEls = document.querySelectorAll(
      '.sku-property-text, .sku-property-item-text, [class*="sku"] span'
    );

    const descEl = 
      document.querySelector('.product-detail-full') ||
      document.querySelector('.product-description') ||
      document.querySelector('#product-description') ||
      document.querySelector('[class*="description"]') ||
      document.querySelector('[data-pl="product-desc"]');

    const videoEl = document.querySelector('video source') || document.querySelector('video') || document.querySelector('iframe');
    const videoUrl = videoEl ? (videoEl.src || videoEl.getAttribute('src') || videoEl.getAttribute('data-src')) : '';

    const ratingEl = document.querySelector('.overview-rating-average') || document.querySelector('[class*="rating"]');
    const rating = ratingEl ? parseFloat(ratingEl.innerText.trim()) : 0;

    const shippingEl = document.querySelector('.product-shipping-info') || document.querySelector('[class*="shipping"]') || document.querySelector('[class*="delivery"]');
    const shippingInfo = shippingEl ? shippingEl.innerText.trim() : '';

    if (!titleEl || !priceEl || imageEls.length === 0) {
      alert("❌ لم يتم العثور على معلومات المنتج! تأكد من أنك في صفحة منتج علي إكسبرس.");
      return;
    }

    const title = titleEl.innerText.trim();
    const price = priceEl.innerText.replace(/[\n\r]+/g, '').trim();

    const images = Array.from(imageEls).map(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('srcset') || '';
      return src.replace(/_50x50\.jpg$/, '_640x640.jpg').split(' ')[0];
    }).filter(src => src);

    const colors = Array.from(colorEls).map(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('srcset') || '';
      return src.replace(/_50x50\.jpg$/, '_640x640.jpg').split(' ')[0];
    }).filter(src => src);

    const sizes = Array.from(sizeEls).map(el => el.innerText.trim()).filter(text => text);

    const description = descEl ? descEl.innerHTML.trim() : '';

    const productData = {
      name: title,
      price: price,
      images: images,
      colors: colors,
      sizes: sizes,
      description: description,
      video: videoUrl,
      rating: rating,
      shipping: shippingInfo,
      sourceUrl: window.location.href,
    };

    // إنشاء Popup
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
    content.style.width = "450px";
    content.style.maxHeight = "90%";
    content.style.overflowY = "auto";
    content.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
    content.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    content.style.textAlign = "center";

    let colorsHtml = '';
    colors.forEach(src => {
      colorsHtml += `<img src="${src}" style="width:28px; height:28px; border-radius:50%; margin:2px; border:1px solid #ddd;" />`;
    });

    content.innerHTML = `
      <h2 style="margin-top:0; color:#333;">معاينة المنتج</h2>
      <img src="${images[0]}" style="width:120px; height:auto; border-radius:8px; margin-bottom:10px; box-shadow:0 2px 8px rgba(0,0,0,0.2);" />
      <strong>الاسم:</strong> <div style="margin-bottom:5px;">${title}</div>
      <strong>السعر:</strong> ${price}<br>
      <strong>التقييم:</strong> ${rating}<br>
      <strong>عدد الصور:</strong> ${images.length}<br>
      <strong>الألوان:</strong><div style="display:flex; justify-content:center; flex-wrap:wrap; margin-bottom:5px;">${colorsHtml}</div>
      <strong>عدد الأحجام:</strong> ${sizes.length}<br>
      <strong>الوصف:</strong>
      <div style="max-height:100px; overflow-y:auto; border:1px solid #ddd; padding:5px; margin:5px 0; text-align:right;">${description.slice(0, 500)}...</div>
      <strong>الشحن:</strong> ${shippingInfo}<br>
      <strong>رابط الفيديو:</strong> <a href="${videoUrl}" target="_blank">مشاهدة</a><br>
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
