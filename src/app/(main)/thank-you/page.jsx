export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Thank You!</h1>
      <p className="text-gray-700 text-lg">
        Your order has been received successfully. We'll contact you soon.
      </p>
      <a href="/" className="mt-6 inline-block bg-green-600 text-white px-5 py-2 rounded">
        Back to Home
      </a>
    </div>
  );
}
