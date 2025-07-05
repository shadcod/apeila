'use client';

import { Toaster, toast } from "react-hot-toast";
import OrderSummary from "@components/checkout/OrderSummary";
import AddressForm from "@components/checkout/AddressForm";
import CouponForm from "@components/checkout/CouponForm";

export default function CheckoutPage() {
  const handleSubmit = (e) => {
    toast.success("✅ Your order has been placed!");
  };

  return (
    <section className="checkout_page checkout mt-[20px]">
      <Toaster position="top-center" />

      <form
        id="form_contact"
        method="post"
        action="https://script.google.com/macros/s/AKfycbzNcBomwhH6vP5zI3osRiY9adWXUHbJR07tiM5ruP2ufKtul-3VGDY7lBmZfB1T22vI/exec"
        onSubmit={handleSubmit}
        target="_blank"
      >
        {/* ✅ الحقول الخفية التي يتم تعبئتها تلقائيًا */}
        <input type="hidden" id="items" name="items" />
        <input type="hidden" id="total_Price" name="Total Price" />
        <input type="hidden" id="count_Items" name="Count Items" />

        {/* ✅ تقسيم الصفحة إلى عمودين باستخدام Grid */}
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ✅ العمود الأيسر: ملخص الطلب */}
          <OrderSummary />

          {/* ✅ العمود الأيمن: نموذج العنوان والكوبون */}
          <div className="input_info">
            <AddressForm />
            <CouponForm />
          </div>
        </div>
      </form>
    </section>
  );
}
