'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Banners({ type }) {
  if (type === 'shopNow') {
    return (
      <div className="banners_4">
        <div className="container">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="box">
              <Link href="#" className="link_btn"></Link>
              <Image
                src={`/img/banner3_${item}.png`}
                alt={`Banner ${item}`}
                width={400}
                height={250}
                style={{ height: 'auto' }}
              />
              <div className="text">
                <h5>Break Disc</h5>
                <h5>Deals on this</h5>
                <div className="sale">
                  <p>Up <br />to</p>
                  <span>70%</span>
                </div>
                <h6>Shop Now</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'twoImages') {
    return (
      <div className="banners">
        <div className="container">
          <div className="banners_boxs banner_2_img">
            <Link href="#" className="box">
              <Image
                src="/img/banner_box4.jpg"
                alt="Banner 4"
                width={800}
                height={300}
                style={{ height: 'auto' }}
              />
            </Link>
            <Link href="#" className="box">
              <Image
                src="/img/banner_box5.jpg"
                alt="Banner 5"
                width={800}
                height={300}
                style={{ height: 'auto' }}
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'threeImages') {
    return (
      <div className="banners">
        <div className="container">
          <div className="banners_boxs banner_3_img">
            <Link href="#" className="box">
              <Image
                src="/img/banner_box1.jpg"
                alt="Banner 1"
                width={600}
                height={250}
                style={{ height: 'auto' }}
              />
            </Link>
            <Link href="#" className="box">
              <Image
                src="/img/banner_box2.jpg"
                alt="Banner 2"
                width={600}
                height={250}
                style={{ height: 'auto' }}
              />
            </Link>
            <Link href="#" className="box">
              <Image
                src="/img/banner_box3.jpg"
                alt="Banner 3"
                width={600}
                height={250}
                style={{ height: 'auto' }}
                
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
