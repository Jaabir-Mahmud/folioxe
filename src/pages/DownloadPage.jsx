import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext.jsx';
import Swal from 'sweetalert2';
import { storage } from '../appwriteClient';
import { Player } from '@lottiefiles/react-lottie-player';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';


const downloadAnimation = {
  v: '5.7.14',
  fr: 60,
  ip: 0,
  op: 180,
  w: 512,
  h: 512,
  nm: 'Success Animation',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Check Mark',
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [256, 256, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 }
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-100, 0], [0, 100], [200, -100]],
                  c: false
                },
                ix: 2
              },
              nm: 'Path 1',
              mn: 'ADBE Vector Shape - Group',
              hd: false
            },
            {
              ty: 'st',
              c: {
                a: 0,
                k: [0.32941176470588235, 0.7215686274509804, 0.2549019607843137, 1],
                ix: 3
              },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 20, ix: 5 },
              lc: 2,
              lj: 2,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: 'Transform'
            }
          ],
          nm: 'Check Mark Group',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false
        },
        {
          ty: 'tm',
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.667], y: [1] },
                o: { x: [0.333], y: [0] },
                t: 30,
                s: [0]
              },
              {
                t: 90,
                s: [100]
              }
            ],
            ix: 1
          },
          e: {
            a: 1,
            k: [
              {
                i: { x: [0.667], y: [1] },
                o: { x: [0.333], y: [0] },
                t: 0,
                s: [0]
              },
              {
                t: 60,
                s: [100]
              }
            ],
            ix: 2
          },
          o: { a: 0, k: 0, ix: 3 },
          m: 1,
          ix: 2,
          nm: 'Trim Paths 1',
          mn: 'ADBE Vector Filter - Trim',
          hd: false
        }
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

const DownloadPage = () => {
  const { cart, removeFromCart } = useCart();
  const { user } = useAuth();
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState([]);

  const BUCKET_ID = '683a18bc0017007f6313';

  const handleDownload = async () => {
    if (!user || !cart || cart.length === 0) {
      console.error('User or cart missing, not recording purchase');
      Swal.fire({
        icon: 'error',
        title: 'Download Error',
        text: 'User not logged in or cart is empty.'
      });
      return;
    }

    setLoading(true);
    const urls = [];

    try {
      for (const { product } of cart) {
        if (product.mainFileId) {
          const res = await storage.getFileDownload(BUCKET_ID, product.mainFileId);
          const href = res.href;
          urls.push({ name: product.title || product.name, url: href });

          const link = document.createElement('a');
          link.href = href;
          link.download = `${product.title || product.name}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      if (urls.length > 0) {
        setDownloadLinks(urls);
        cart.forEach(item => removeFromCart(item.product.id));
        setDownloaded(true);
        // AUTOMATE: Record purchase in Firestore
        try {
          await addDoc(collection(db, 'purchases'), {
            userId: user.uid,
            items: cart.map(({ product }) => ({ id: product.id, name: product.title || product.name })),
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          console.error('Error recording purchase:', err);
          Swal.fire({
            icon: 'error',
            title: 'Purchase Record Failed',
            text: err.message || 'Could not record your purchase.'
          });
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No Downloads',
          text: 'No downloadable files found for your cart.'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: err.message || 'Something went wrong.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-xl w-full text-center">
        <Player
          autoplay
          loop={false}
          src={downloadAnimation}
          className="mx-auto w-64 h-64"
        />
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          {downloaded ? 'Files Downloaded!' : 'Payment Successful!'}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {downloaded
            ? 'Your files were downloaded and removed from your cart.'
            : 'Thank you for your purchase. You can now download your files below.'}
        </p>
        <button
          onClick={handleDownload}
          disabled={loading || downloaded}
          className={`px-6 py-3 text-white font-semibold rounded transition shadow ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : downloaded
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Preparing...' : downloaded ? 'Downloaded' : 'Download Items'}
        </button>

        {downloadLinks.length > 0 && (
          <div className="mt-6 text-left">
            <h2 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
              Downloaded Files:
            </h2>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
              {downloadLinks.map((item, idx) => (
                <li key={idx}>
                  <a href={item.url} className="text-blue-600 underline" download>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
