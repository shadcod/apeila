export default function AddressForm() {
  return (
    <div className="address">
      <h2>Delivery Address</h2>
      <div className="inputs">
        <label>Email</label>
        <input
          type="email"
          name="Email"
          placeholder="Enter your email"
          required
        />

        <label>Name</label>
        <input
          type="text"
          name="Name"
          placeholder="Enter your Name"
          required
        />

        <label>Address</label>
        <input
          type="text"
          name="Address"
          placeholder="Enter your Address"
          required
        />

        <label>Phone</label>
        <input
          type="tel"
          name="Phone"
          placeholder="Enter your Phone"
          required
        />
      </div>
    </div>
  );
}
