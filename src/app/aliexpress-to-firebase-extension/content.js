console.log("🚀 AliExpress Content Script Loaded!");

const addButton = document.createElement("button");
addButton.innerText = "🟢 أضف إلى موقعي";
Object.assign(addButton.style, {
  position: "fixed",
  top: "100px",
  right: "20px",
  zIndex: 9999,
  padding: "10px 15px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontFamily: "Tahoma, sans-serif",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
});

addButton.onclick = async () => {
  try {
    console.log("🔎 زر الإضافة تم الضغط عليه!");

    // استخراج البيانات (مثل كودك السابق)
    const titleEl =
      document.querySelector('h1[data-pl="product-title"]') ||
      document.querySelector('h1.product-title-text') ||
      document.querySelector('h1.product-title') ||
      document.querySelector('h1') ||
      document.querySelector('[class*="title"]');
    const title = titleEl ? titleEl.innerText.trim() : "";

    const priceEl =
      document.querySelector('.product-price-value') ||
      document.querySelector('.product-price-current') ||
      document.querySelector('.product-price') ||
      document.querySelector('[class*="price"]');
    const priceText = priceEl ? priceEl.innerText.replace(/[\n\r]+/g, "").trim() : "";

    const imageEls = document.querySelectorAll(
      ".images-view-item img, .images-view-list img, .sku-image-list img, [class*='image'] img"
    );
    const images = Array.from(imageEls).map(img => {
      const src = img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("srcset") || "";
      return src.replace(/_50x50\.jpg$/, "_640x640.jpg").split(" ")[0];
    }).filter(src => src);

    const colorEls = document.querySelectorAll(
      ".sku-property-item img, .sku-property-color img, [class*='sku'] img"
    );
    const colors = Array.from(colorEls).map(img => {
      const src = img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("srcset") || "";
      return src.replace(/_50x50\.jpg$/, "_640x640.jpg").split(" ")[0];
    }).filter(src => src);

    const sizeEls = document.querySelectorAll(
      ".sku-property-text, .sku-property-item-text, [class*='sku'] span"
    );
    const sizes = Array.from(sizeEls).map(el => el.innerText.trim()).filter(text => text);

    const descEl =
      document.querySelector(".product-detail-full") ||
      document.querySelector(".product-description") ||
      document.querySelector("#product-description") ||
      document.querySelector('[class*="description"]') ||
      document.querySelector('[data-pl="product-desc"]');
    const description = descEl ? descEl.innerHTML.trim() : "";

    const videoEl = document.querySelector("video source") || document.querySelector("video") || document.querySelector("iframe");
    const videoUrl = videoEl ? (videoEl.src || videoEl.getAttribute("src") || videoEl.getAttribute("data-src")) : "";

    const ratingEl = document.querySelector(".overview-rating-average") || document.querySelector('[class*="rating"]');
    const rating = ratingEl ? parseFloat(ratingEl.innerText.trim()) : 0;

    const shippingEl = document.querySelector(".product-shipping-info") || document.querySelector('[class*="shipping"]') || document.querySelector('[class*="delivery"]');
    const shippingInfo = shippingEl ? shippingEl.innerText.trim() : "";

    if (!title || !priceText || images.length === 0) {
      alert("❌ لم يتم العثور على معلومات المنتج! تأكد من أنك في صفحة منتج علي إكسبرس.");
      return;
    }

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

    // إنشاء بيانات المنتج مع إمكانيّة تعديل الاسم، السعر، الوصف:
    let productData = {
      id,
      name: title,
      price: priceText,
      images,
      colors,
      sizes,
      description,
      video: videoUrl,
      rating,
      shipping: shippingInfo,
      sourceUrl: window.location.href,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false,
      inStockCount: 0,
      views: 0,
    };

    // إنشاء الـ modal الرئيسي
    const modal = document.createElement("div");
    Object.assign(modal.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10000,
      overflowY: "auto",
      padding: "20px",
      boxSizing: "border-box",
    });

    // صندوق المحتوى
    const content = document.createElement("div");
    Object.assign(content.style, {
      background: "#fff",
      borderRadius: "10px",
      width: "600px",
      maxHeight: "90vh",
      overflowY: "auto",
      padding: "25px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
      boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
    });

    // بناء HTML داخل المحتوى مع حقول تعديل
    content.innerHTML = `
      <h2 style="margin-top:0; margin-bottom:20px; text-align:center;">معاينة وتعديل المنتج</h2>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">الاسم:</label><br/>
        <input id="prodName" type="text" value="${productData.name}" style="width:100%; padding:8px; margin-top:4px; border-radius:4px; border:1px solid #ccc;" />
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">السعر:</label><br/>
        <input id="prodPrice" type="text" value="${productData.price}" style="width:100%; padding:8px; margin-top:4px; border-radius:4px; border:1px solid #ccc;" />
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">الصور (${productData.images.length}):</label>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; justify-content:center;">
          ${productData.images.map(src => `<img src="${src}" style="width:70px; height:70px; object-fit:cover; border-radius:6px; border:1px solid #ddd;" />`).join("")}
        </div>
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">الألوان (${productData.colors.length}):</label>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; justify-content:center;">
          ${productData.colors.map(src => `<img src="${src}" style="width:28px; height:28px; border-radius:50%; border:1px solid #ddd;" />`).join("")}
        </div>
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">الأحجام (${productData.sizes.length}):</label>
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px; justify-content:center;">
          ${productData.sizes.map(size => `<div style="padding:6px 12px; border:1px solid #bbb; border-radius:4px; background:#f8f8f8;">${size}</div>`).join("")}
        </div>
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">الوصف:</label><br/>
        <textarea id="prodDesc" rows="6" style="width:100%; padding:8px; border-radius:4px; border:1px solid #ccc; margin-top:4px;">${productData.description.replace(/<[^>]+>/g, '')}</textarea>
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">الشحن:</label><br/>
        <div style="padding:8px; background:#f1f1f1; border-radius:4px;">${productData.shipping || "لا توجد معلومات"}</div>
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">رابط الفيديو:</label><br/>
        ${productData.video ? `<a href="${productData.video}" target="_blank" style="color:#0073e6;">مشاهدة الفيديو</a>` : `<span style="color:#999;">لا يوجد فيديو</span>`}
      </section>

      <section style="margin-bottom:20px;">
        <label style="font-weight:bold;">التقييم:</label><br/>
        <div style="font-size:1.2em; color:#f5a623;">⭐ ${productData.rating || "0"}</div>
      </section>

      <div style="text-align:center; margin-top:30px;">
        <button id="sendBtn" style="background-color: #28a745; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-right: 10px;">إرسال ✅</button>
        <button id="cancelBtn" style="background-color: #dc3545; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">إلغاء ❌</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // تحديث قيم productData عند تعديل الحقول
    const nameInput = document.getElementById("prodName");
    const priceInput = document.getElementById("prodPrice");
    const descInput = document.getElementById("prodDesc");

    nameInput.oninput = () => (productData.name = nameInput.value.trim());
    priceInput.oninput = () => (productData.price = priceInput.value.trim());
    descInput.oninput = () => (productData.description = descInput.value.trim());

    document.getElementById("cancelBtn").onclick = () => {
      document.body.removeChild(modal);
      console.log("❌ تم الإلغاء من قبل المستخدم");
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        console.log("❌ تم الإغلاق بالنقر على الخلفية");
      }
    };

    document.getElementById("sendBtn").onclick = async () => {
      if (!productData.name || !productData.price) {
        alert("❌ الاسم والسعر لا يمكن أن يكونا فارغين!");
        return;
      }
      console.log("✅ Sending product data:", productData);

      try {
        const res = await fetch("https://apeila-me.vercel.app/api/products/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
