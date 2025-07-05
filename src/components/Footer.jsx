'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const findItFastLinks = [
    "Laptops & Computers",
    "Smartphones & Tablets",
    "TV & Studio",
    "Appliances",
    "Jewelry & Watches"
  ];

const quickLinks = [
  { name: "Your Account", href: "/footer-links/account" },
  { name: "Returns & Exchanges", href: "/footer-links/returns" },
  { name: "Shipping & Delivery", href: "/footer-links/shipping" },
  { name: "Estimated Delivery", href: "/footer-links/estimated-delivery" },
  { name: "Purchase History", href: "/footer-links/purchase-history" }
];

const serviceLinks = [
  { name: "Support Center", href: "/footer-links/support" },
  { name: "Terms & Conditions", href: "/footer-links/terms" },
  { name: "Privacy Policy", href: "/footer-links/privacy" },
  { name: "Help", href: "/footer-links/help" },
  { name: "FAQs", href: "/footer-links/faqs" }
];


  return (
    <footer>
      <div className="container">
        <div className="big_row">
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="apeila Logo"
              width={115}
              height={70}
              className="logo_footer"
              style={{ height: 'auto', width: 'auto' }}
            />
          </Link>

          <p>Best online shopping store with a wide variety of products</p>
          <div className="icons_footer">
            <Link href="#"><i className="fa-solid fa-phone"></i></Link>
            <Link href="#"><i className="fa-brands fa-facebook"></i></Link>
            <Link href="#"><i className="fa-brands fa-square-instagram"></i></Link>
            <Link href="#"><i className="fa-brands fa-x-twitter"></i></Link>
          </div>
        </div>

        <div className="row">
          <h4>Find It Fast</h4>
          <div className="links">
            {findItFastLinks.map((link, index) => (
              <Link key={index} href="#">
                <i className="fa-solid fa-caret-right"></i> {link}
              </Link>
            ))}
          </div>
        </div>

        <div className="row">
          <h4>Quick Links</h4>
          <div className="links">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <i className="fa-solid fa-caret-right"></i> {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="row">
          <h4>Service Us</h4>
          <div className="links">
            {serviceLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <i className="fa-solid fa-caret-right"></i> {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bottom_footer">
        <div className="container">
          <p>&copy; <span>2009-2025 Apeila </span> Inc. All Rights Reserved</p>
          <Image
            src="/img/payment_method.png"
            alt="Payment Methods"
            width={350}
            height={50}
            style={{ height: 'auto', width: 'auto' }}
            className="payment_img"
          />
        </div>
      </div>
    </footer>
  );
}
